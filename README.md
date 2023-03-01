# Prueba Técnica Ionix

1.- Genere una API Rest(Java o Node) que permita las siguientes acciones:
- Login de usuario (debe considerar 3 perfiles). El login debe entregar un “token”
o algún mecanismo que permita identificar el perfil el cual se usará para
identificar sobre qué servicios puede consumir.
- Los usuarios con perfil Administrador pueden realizar lo siguiente:
o CRUD de usuarios
§ Los usuarios parten con una contraseña temporal la cual deben
cambiar en el primer login
§ Los usuarios puedes tener perfil “Ejecutor” o “Auditor”, no
puede crear otros usuarios tipo “Administrador”
o CRUD de “tareas”
§ Una tarea tiene al menos los siguientes datos: título,
descripción, fecha de vencimiento.
§ Cuando crea una tarea debe poder asignársela a un usuario con
perfil “Ejecutor”.
§ No puede eliminar o actualizar una tarea en estado distinto a
“Asignado”
- Los usuarios con perfil Ejecutor pueden realizar lo siguiente:
o Listar sus tareas asignadas y ver el detalle
o Actualizar el estado de una tarea. Si la tarea ya está vencida no debe
permitir esta acción.
o Agregar un comentario sobre una tarea vencida.
- Los usuarios con perfil Auditor pueden realizar lo siguiente:
o Visualizar el listado de tareas asignadas a cualquier usuario y ver su
estado.
- Actualización de contraseña (para cualquier perfil)
- Logout de usuario


### Pre-requisitos 📋

**Debera tener instalado:**
* **Angular**           : v11
* **NodeJS**            : v18.12.0
* **npm**               : 9.19.2


### Instalación 🔧

Al momento de tener nuestro ambiente configurado y clonar nuestro codigo, ejecutamos en una ventana
de comandos **npm install** para descargar nuestras dependencias en cada uno de los proyectos


## Autores ✒️
Contraseña Administrador = Ionix2023+
Contraseña por primera vez = Ionix2023+First


## Autores ✒️

* **Diego Mesa** - *Lider Técnico*


## Expresiones de Gratitud 🎁

* Invita una cerveza 🍺 a alguien del equipo.
