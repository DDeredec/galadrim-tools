import { WorkplaceSvgRoom } from '../reusableComponents/WorkplaceSvg/WorkplaceSvg'

export const RESERVABLE_ROOMS = [
    'Adier',
    'Coffre',
    'Kitchen',
    'Manguier',
    'Turing',
    'Vador',
    'Cube',
    'Arche',
    'Nantes_Boudoir',
    'Nantes_Torture',
    'Nantes_Cave',
    'Nantes_Placard',
    'SaintPaul_Amesh',
    'SaintPaul_Lovelace',
    'SaintPaul_Turing',
    'SaintPaul_Manguier',
    'SaintPaul_Tresor',
    "SaintPaul_Olympe",
    "SaintPaul_Foret",
    "SaintPaul_Mediterranee",
] as const

export type ReservableWorkplaceSvgRoom = typeof RESERVABLE_ROOMS[number]

export type RoomFullName = typeof AllRooms[number]['name']

export type WorkspaceLocation = 'bonneNouvelle' | 'saintPaul' | 'nantes'

export const ValidLocations = [
    'bonneNouvelle',
    'saintPaul',
    'nantes',
]

export const BonneNouvelleRooms = [
    {
        name: 'Salle Vador',
    },
    {
        name: 'Salle Adier',
    },
    {
        name: 'Salle Turing',
    },
    {
        name: 'Salle manguier massif',
    },
    {
        name: 'Salle du coffre',
    },
    {
        name: 'Cuisine',
    },
    {
        name: 'Le Cube',
    },
    {
        name: "L'Arche",
    },
] as const

export const NantesRooms = [
    {
        name: "Nantes - Le boudoir",
    },
    {
        name: "Nantes - La salle de torture",
    },
    {
        name: "Nantes - La cave",
    },
    {
        name: "Nantes - Le placard",
    }
] as const

// TODO: rajouter les vrais noms des salles
export const SaintPaulRooms = [
    {
        name: 'Salle Amesh'
    },
    {
        name: 'Salle Lovelace'
    },
    {
        name: 'Salle Turing'
    },
    {
        name: 'Salle du manguier (ultra)-massif'
    },
    {
        name: 'Salle du Trésor'
    },
    {
        name: "L'Olympe"
    },
    {
        name: 'La Forêt'
    },
    {
        name: 'Salle Méditerranée'
    },
] as const


export const AllRooms = [
    {
        name: '*',
    },
    ...BonneNouvelleRooms,
    ...NantesRooms,
    ...SaintPaulRooms,
] as const

const WorkplaceSvgRoomToFullRoomName: {
    [K in ReservableWorkplaceSvgRoom]: RoomFullName
} = {
    Adier: 'Salle Adier',
    Coffre: 'Salle du coffre',
    Kitchen: 'Cuisine',
    Manguier: 'Salle manguier massif',
    Vador: 'Salle Vador',
    Turing: 'Salle Turing',
    Cube: 'Le Cube',
    Arche: "L'Arche",
    Nantes_Boudoir: "Nantes - Le boudoir",
    Nantes_Cave: "Nantes - La cave",
    Nantes_Torture: "Nantes - La salle de torture",
    Nantes_Placard: "Nantes - Le placard",
    SaintPaul_Amesh: "Salle Amesh",
    SaintPaul_Lovelace: "Salle Lovelace",
    SaintPaul_Turing: "Salle Turing",
    SaintPaul_Manguier: "Salle du manguier (ultra)-massif",
    SaintPaul_Tresor: 'Salle du Trésor',
    SaintPaul_Olympe: "L'Olympe",
    SaintPaul_Foret: 'La Forêt',
    SaintPaul_Mediterranee: 'Salle Méditerranée',
}

export function isReservableRoom(room: WorkplaceSvgRoom): room is ReservableWorkplaceSvgRoom {
    return RESERVABLE_ROOMS.includes(room as ReservableWorkplaceSvgRoom)
}

export function getReservableRoomFullName(room: WorkplaceSvgRoom) {
    if (!isReservableRoom(room)) {
        return null
    }
    return WorkplaceSvgRoomToFullRoomName[room]
}
