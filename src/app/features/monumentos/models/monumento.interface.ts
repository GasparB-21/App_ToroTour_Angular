export interface Monumento {
    id: string;
    nombre: string;
    tipoMonumento: string;
    identificadorBienInteresCultural: string;
    calle: string;
    clasificacion: string;
    tipoConstruccion: string;
    codigoPostal: string;
    descripcion: string;
    periodoHistorico: string;
    provincia: string;
    municipio: string;
    localidad: string;
    coordenadas: {
      latitud: number;
      longitud: number;
    };
}