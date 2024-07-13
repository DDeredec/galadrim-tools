import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RestaurantReview from '#app/Models/RestaurantReview'
import { validateResourceId } from '#app/Scaffolder/validateResourceId'

export const showRestaurantReview = async ({ params, bouncer }: HttpContextContract) => {
    const { id } = await validateResourceId(params)

    const restaurantReview = await RestaurantReview.findOrFail(id)

    await bouncer.with('RestaurantsPolicy').authorize('viewUpdateOrDelete', restaurantReview)

    return restaurantReview
}
