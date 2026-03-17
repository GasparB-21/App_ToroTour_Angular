export interface Evento {
    id: string;
    titulo: string;
    descripcion: string;
    tematica: string;
    categoria: string;
    fecha: {
      inicio: string;
      fin: string;
    };
    hora: {
        inicio: string;
        fin: string;
    };
    precio: string;
    colectivoDestinatario: string;
    destinatarios: string;
    imagen: string;
    lugarCelebracion: string;
    nombreLocalidad: string;
    nombreProvincia: string;
    calle: string;
    cp: string;
    eventoEnBiblioteca: string;
    coordenadas: {
        latitud: number;
        longitud: number;
    };
    enlace: string;
}