import RestaurantChoice from "#models/restaurant_choice";
import RestaurantNote from "#models/restaurant_note";
import RestaurantRewind from "#models/restaurant_rewind";
import { getAdjective } from "./utils/getAdjective.js";
import { getAnimal } from "./utils/getAnimal.js";
import { getDistanceTravelled } from "./utils/getDistanceTravelled.js";
import { getFavoriteRestaurantCount } from "./utils/getFavoriteRestaurantCount.js";
import { getRestaurantPerTag } from "./utils/getRestaurantPerTag.js";
import { getRewindRank } from "./utils/getRewindRank.js";
import { getTotalPrice } from "./utils/getTotalPrice.js";

export const generateRewindForUser = async (
    userId: number,
    distanceRankingMap: Map<number, number>,
    wealthRankingMap: Map<number, number>,
) => {
    const choices = await RestaurantChoice.query()
        .leftJoin("restaurants", "restaurant_choices.restaurant_id", "restaurants.id")
        .as("restaurant")
        .joinRaw(
            "LEFT JOIN LATERAL (SELECT json_arrayagg(tags.name) as tagNames FROM restaurant_tag LEFT JOIN tags ON restaurant_tag.tag_id = tags.id WHERE restaurant_tag.restaurant_id = restaurants.id ORDER BY restaurant_tag.id DESC) AS restaurant_tag ON true",
        )
        .where("restaurant_choices.user_id", userId);

    const dailyChoiceCount = choices.length;

    if (dailyChoiceCount === 0) {
        return null;
    }

    const { favoriteRestaurantId, favoriteRestaurantCount } = getFavoriteRestaurantCount(choices);
    const restaurantPerTag = getRestaurantPerTag(choices);
    const totalDistanceTravelled = getDistanceTravelled(choices);
    const averageDistanceTravelled = Math.round(totalDistanceTravelled / dailyChoiceCount);
    const totalPrice = getTotalPrice(choices);
    const averagePrice = +(totalPrice / dailyChoiceCount).toFixed(2);

    const restaurantNotes = await RestaurantNote.query().where("user_id", userId);

    const restaurantAverageScore = +(
        restaurantNotes.reduce((acc, note) => acc + +note.note, 0) / restaurantNotes.length
    ).toFixed(1);

    const { maxRank, userRank } = await getRewindRank(userId);

    const animal = getAnimal(userId, distanceRankingMap);
    const adjective = getAdjective(userId, wealthRankingMap);
    const newRewind = await RestaurantRewind.create({
        userId,
        dailyChoiceCount,
        favoriteRestaurantId,
        favoriteRestaurantCount,
        restaurantPerTag,
        restaurantAverageScore,
        totalDistanceTravelled,
        averageDistanceTravelled,
        totalPrice,
        averagePrice,
        personality: [animal, adjective],
        maxRank,
        userRank,
        wealthRank: wealthRankingMap.get(userId) ?? null,
        distanceRank: distanceRankingMap.get(userId) ?? null,
    });

    return newRewind;
};
