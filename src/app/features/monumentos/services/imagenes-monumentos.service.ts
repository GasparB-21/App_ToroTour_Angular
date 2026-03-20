import { Injectable } from '@angular/core';

import { ICONOS_PERIODO, ICONOS_TIPO, ICONOS_CLASIFICACION } from './categorias-tipos';

@Injectable({
  providedIn: 'root',
})
export class ImagenesMonumentosService {

  //Lógica para asignar imagenes desde un diccionario a partir de las categorias del monumento

  /*=======*/
  /*PERIODO*/
  /*=======*/
  getImagenPeriodo(periodo?: string): string {
    if (!periodo) return ICONOS_PERIODO.default;

    const p = periodo.trim().toLowerCase();

    // 🗿 PREHISTORIA
    if (
      p.includes('paleolítico') ||
      p.includes('neolítico') ||
      p.includes('edad del bronce') ||
      p.includes('edad del cobre') ||
      p.includes('edad del hierro') ||
      p.includes('prehistoria') ||
      p.includes('postpaleolítico')
    ) {
      return ICONOS_PERIODO.primitivo;
    }

    // 🛡️ CELTA / PRERROMANO
    if (
      p.includes('celta') ||
      p.includes('celtibérico') ||
      p.includes('prerromano')
    ) {
      return ICONOS_PERIODO.celta;
    }

    // 🏛️ ROMANO
    if (
      p.includes('romano') ||
      p.includes('tardoromano') ||
      p.includes('paleocristiano')
    ) {
      return ICONOS_PERIODO.romano;
    }

    // ⛪ MEDIEVAL
    if (
      p.includes('medieval') ||
      p.includes('edad media') ||
      p.includes('visigodo') ||
      p.includes('califal')
    ) {
      return ICONOS_PERIODO.medieval;
    }

    // 🏰 MODERNO
    if (p.includes('edad moderna')) {
      return ICONOS_PERIODO.moderno;
    }

    // 🏙️ CONTEMPORÁNEO
    if (p.includes('edad contemporanea')) {
      return ICONOS_PERIODO.contemporaneo;
    }

    return ICONOS_PERIODO.default;
  }

  getNombrePeriodo(periodo?: string): string {
    if (!periodo) return 'Edad Media';

    const p = periodo.trim().toLowerCase();

    // 🗿 PREHISTORIA
    if (
      p.includes('paleolítico') ||
      p.includes('neolítico') ||
      p.includes('edad del bronce') ||
      p.includes('edad del cobre') ||
      p.includes('edad del hierro') ||
      p.includes('prehistoria') ||
      p.includes('postpaleolítico')
    ) {
      return 'Prehistoria';
    }

    // 🛡️ CELTA
    if (
      p.includes('celta') ||
      p.includes('celtibérico') ||
      p.includes('prerromano')
    ) {
      return 'Celta';
    }

    // 🏛️ ROMANO
    if (
      p.includes('romano') ||
      p.includes('tardoromano') ||
      p.includes('paleocristiano')
    ) {
      return 'Romano';
    }

    // ⛪ MEDIEVAL
    if (
      p.includes('medieval') ||
      p.includes('edad media') ||
      p.includes('visigodo') ||
      p.includes('califal')
    ) {
      return 'Edad Media';
    }

    // 🏰 MODERNO
    if (p.includes('edad moderna')) {
      return 'Edad Moderna';
    }

    // 🏙️ CONTEMPORÁNEO
    if (p.includes('edad contemporanea')) {
      return 'Edad Contemporánea';
    }

    return 'Edad Media';
  }


  /*====*/
  /*TIPO*/
  /*====*/
  getImagenTipo(tipoConstruccion?: string): string {
    if(!tipoConstruccion) return ICONOS_TIPO.default;

    const tipo = tipoConstruccion.trim().toLowerCase();

    // 1. Arquitectura Religiosa
    if (
      tipo.includes('catedral') ||
      tipo.includes('iglesia') ||
      tipo.includes('ermita') ||
      tipo.includes('monasterio') ||
      tipo.includes('convento') ||
      tipo.includes('colegiata') ||
      tipo.includes('santuario') ||
      tipo.includes('sinagoga') ||
      tipo.includes('cripta') ||
      tipo.includes('eremitorio')
    ) {
      return ICONOS_TIPO.religiosa;
    }

    // 2. Arquitectura Civil y Poder
    if (
      tipo.includes('ayuntamiento') ||
      tipo.includes('palacio') ||
      tipo.includes('casa noble') ||
      tipo.includes('colegio') ||
      tipo.includes('edificio universitario') ||
      tipo.includes('ciudad') ||
      tipo.includes('villa') ||
      tipo.includes('plaza') ||
      tipo.includes('real sitio')
    ) {
      return ICONOS_TIPO.civil;
    }

    // 3. Defensa y Estructuras Militares
    if (
      tipo.includes('castillo') ||
      tipo.includes('fortaleza') ||
      tipo.includes('atalaya') ||
      tipo.includes('muralla') ||
      tipo.includes('torre') ||
      tipo.includes('puerta') ||
      tipo.includes('campamento') ||
      tipo.includes('castro')
    ) {
      return ICONOS_TIPO.defensa;
    }

    // 4. Patrimonio Arqueológico y Tradicional
    if (
      tipo.includes('dolmen') ||
      tipo.includes('megalítico') ||
      tipo.includes('megalitico') ||
      tipo.includes('necrópolis') ||
      tipo.includes('necropolis') ||
      tipo.includes('restos paleontológicos') ||
      tipo.includes('restos paleontologicos') ||
      tipo.includes('arte rupestre') ||
      tipo.includes('minas') ||
      tipo.includes('despoblado') ||
      tipo.includes('poblado') ||
      tipo.includes('hórreo') ||
      tipo.includes('horreo') ||
      tipo.includes('edificio antiguo')
    ) {
      return ICONOS_TIPO.patrimonio;
    }

    // 5. Infraestructura y Espacio Público
    if (
      tipo.includes('puente') ||
      tipo.includes('calzada') ||
      tipo.includes('fuentes') ||
      tipo.includes('fuente') ||
      tipo.includes('jardín') ||
      tipo.includes('jardin') ||
      tipo.includes('teatro') ||
      tipo.includes('escultura') ||
      tipo.includes('estatua')
    ) {
      return ICONOS_TIPO.publico;
    }

    return ICONOS_TIPO.default;
    
  }

  getNombreTipo(tipoConstruccion?: string): string {
    if (!tipoConstruccion) return 'Arquitectura Religiosa';

    const tipo = tipoConstruccion.trim().toLowerCase();

    // ⛪ Arquitectura Religiosa
    if (
      tipo.includes('catedral') ||
      tipo.includes('iglesia') ||
      tipo.includes('ermita') ||
      tipo.includes('monasterio') ||
      tipo.includes('convento') ||
      tipo.includes('colegiata') ||
      tipo.includes('santuario') ||
      tipo.includes('sinagoga') ||
      tipo.includes('cripta') ||
      tipo.includes('eremitorio')
    ) {
      return 'Arquitectura Religiosa';
    }

    // 🏛️ Arquitectura Civil y Poder
    if (
      tipo.includes('ayuntamiento') ||
      tipo.includes('palacio') ||
      tipo.includes('casa noble') ||
      tipo.includes('colegio') ||
      tipo.includes('edificio universitario') ||
      tipo.includes('ciudad') ||
      tipo.includes('villa') ||
      tipo.includes('plaza') ||
      tipo.includes('real sitio')
    ) {
      return 'Arquitectura Civil';
    }

    // ⚔️ Defensa
    if (
      tipo.includes('castillo') ||
      tipo.includes('fortaleza') ||
      tipo.includes('atalaya') ||
      tipo.includes('muralla') ||
      tipo.includes('torre') ||
      tipo.includes('puerta') ||
      tipo.includes('campamento') ||
      tipo.includes('castro')
    ) {
      return 'Estructuras Militares';
    }

    // 🏺 Patrimonio
    if (
      tipo.includes('dolmen') ||
      tipo.includes('megalítico') ||
      tipo.includes('megalitico') ||
      tipo.includes('necrópolis') ||
      tipo.includes('necropolis') ||
      tipo.includes('arte rupestre') ||
      tipo.includes('minas') ||
      tipo.includes('despoblado') ||
      tipo.includes('poblado') ||
      tipo.includes('hórreo') ||
      tipo.includes('horreo') ||
      tipo.includes('edificio antiguo')
    ) {
      return 'Patrimonio Arqueológico';
    }

    // 🌉 Público
    if (
      tipo.includes('puente') ||
      tipo.includes('calzada') ||
      tipo.includes('fuente') ||
      tipo.includes('jardín') ||
      tipo.includes('jardin') ||
      tipo.includes('teatro') ||
      tipo.includes('escultura') ||
      tipo.includes('estatua')
    ) {
      return 'Espacio Público';
    }

    return 'Arquitectura Religiosa';
  }


  /*=============*/
  /*CLASIFICACIÓN*/
  /*=============*/
  getImagenClasificacion(clasificacion?: string): string {
    if (!clasificacion) return ICONOS_CLASIFICACION.default;

    const t = clasificacion.trim().toLowerCase();

    // 🏛️ Patrimonio Arquitectónico
    if (
      t.includes('arquitectura civil') ||
      t.includes('arquitectura militar') ||
      t.includes('arquitectura religiosa') ||
      t.includes('arquitectura popular')
    ) {
      return ICONOS_CLASIFICACION.patrimonio;
    }

    // 🌄 Paisaje
    if (
      t.includes('paraje pintoresco') ||
      t.includes('jardín histórico') ||
      t.includes('jardin historico')
    ) {
      return ICONOS_CLASIFICACION.paisaje;
    }

    // 🏺 Cultura y Etnografía
    if (
      t.includes('conjunto etnológico') ||
      t.includes('conjunto etnologico') ||
      t.includes('museo')
    ) {
      return ICONOS_CLASIFICACION.cultural;
    }

    return ICONOS_CLASIFICACION.default;
  }

  getNombreClasificacion(tipo?: string): string {
    if (!tipo) return 'Patrimonio';

    const t = tipo.trim().toLowerCase();

    // 🏛️ Arquitectónico
    if (
      t.includes('arquitectura civil') ||
      t.includes('arquitectura militar') ||
      t.includes('arquitectura religiosa') ||
      t.includes('arquitectura popular')
    ) {
      return 'Patrimonio';
    }

    // 🌄 Paisaje
    if (
      t.includes('paraje pintoresco') ||
      t.includes('jardín histórico') ||
      t.includes('jardin historico')
    ) {
      return 'Paisajes';
    }

    // 🏺 Etnografía
    if (
      t.includes('conjunto etnológico') ||
      t.includes('conjunto etnologico') ||
      t.includes('museo')
    ) {
      return 'Cultural';
    }

    return 'Patrimonio';
  }
}
