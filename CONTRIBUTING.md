# CONTRIBUIR A VISOR URBANO

Para añadir un componente y visualizarlo en el panel lateral sigue los siguientes pasos.

1. Tu componente debe implementar la interfaz `SidePanelContentComponent` definida en el archivo: `src/app/services/side-panel.interface.ts`.
2. Registra tu componente en el arreglo `entryComponents` del Módulo principal de la aplicación (`AppModule`).
3. Para mostrar tu componente utiliza el método `open()` del servicio `SidePanelService`.

## Ejemplo de uso

```
// dummy.component.ts

... 

export class DummyComponent implements SidePanelContentComponent {

  // La lógica de tu componente va aquí
  
  ... 
  
  open() { 
    // Hacer algo al mostrar
  }
  
  close() {
    // Hacer algo al cerrar
  }
}



// app.module.ts

...
  entryComponents: [ ..., DummyComponent ]
...



// utilizo.dummy.component


  constructor( private sps: SidePanelService) {}

  ... 
  
  openDummy() {
    this.sps.open( DummyComponent as any, {
      title: Dummy Componente,
      headerSize: 'small'
    });
  }

```

