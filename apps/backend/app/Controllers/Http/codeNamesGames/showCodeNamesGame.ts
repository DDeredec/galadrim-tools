import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CodeNamesGame from '#app/Models/CodeNamesGame'

export const showCodeNamesGame = async ({ params }: HttpContextContract) => {
    return CodeNamesGame.query().where('id', params.id).preload('rounds').firstOrFail()
}
