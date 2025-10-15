export interface ILocation { // para las cordenadas
    latitude: number;
    longitude: number;
}

export interface IProfessional {
    id: string;
    name: string;
    lastname: string;
    dni: string;
    phone: string;
    license: string;
    specialty: 'veterinario' | 'peluqueria' | 'veterinario y peluqueria';
    biography: string;
    nameEstablishment: string;
    street: string;
    streetNumber: string;
    neighborhood: string;
    province: string;
    postalCode: string;
    location: string;
    imagesUrl: string;
    email: string;
    password: string;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
// estos datos son los que se mandan por frontend al crear un profesional
// {
//   "name": "Lucía",
//   "lastname": "Gómez",
//   "dni": "30123456",
//   "phone": "+54 9 11 2345 6789",
//   "license": "MV-456789",
//   "specialty": "veterinario",
//   "biography": "Profesional con más de 10 años de experiencia en el cuidado integral de mascotas.",
//   "nameEstablishment": "Clínica Animal Vida",
//   "street": "Av. San Martín",
//   "streetNumber": "1234",
//   "neighborhood": "Villa Urquiza",
//   "province": "Buenos Aires",
//   "postalCode": "1431",
//   "location": "Buenos Aires, Argentina",
//   "imagesUrl": "https://example.com/images/clinica-animal-vida.jpg",
//   "email": "lucia.gomez@animalvida.com",
//   "password": "veterinario123"

// }


export type ProfessionalCreate = Omit<IProfessional , 'id' | 'createdAt' | 'updatedAt'>;