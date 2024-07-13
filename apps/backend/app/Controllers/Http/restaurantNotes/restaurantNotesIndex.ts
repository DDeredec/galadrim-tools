import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RestaurantNote from '#app/Models/RestaurantNote'

export const indexRoute = async (_params: HttpContextContract) => {
    const restaurantNotes = await RestaurantNote.all()
    return restaurantNotes.map((note) => note.frontendData)
}
