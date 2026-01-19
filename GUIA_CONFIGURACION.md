# Guía de Configuración: Google Sheets API

Para que la aplicación pueda guardar datos en tu hoja de cálculo, necesitamos configurar un acceso seguro ("Service Account") en Google Cloud.

## 1. Crear un Proyecto en Google Cloud
1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un nuevo proyecto (ej. `ControlGastos`).

## 2. Habilitar Google Sheets API
1. En el menú lateral, ve a **APIs & Services** > **Library**.
2. Busca "Google Sheets API".
3. Haz clic en **Enable**.

## 3. Crear Credenciales (Service Account)
1. Ve a **APIs & Services** > **Credentials**.
2. Haz clic en **+ CREATE CREDENTIALS** > **Service Account**.
3. Ponle un nombre (ej. `gestor-gastos`) y dale a **Create**.
4. En "Grant this service account access to project", selecciona el rol **Editor** (para que pueda escribir). Dale a **Done**.

## 4. Generar Clave Secreta (JSON)
1. En la lista de Service Accounts, haz clic en el email de la cuenta que acabas de crear (ej. `gestor-gastos@...`).
2. Ve a la pestaña **Keys**.
3. Haz clic en **Add Key** > **Create new key**.
4. Selecciona **JSON** y dale a **Create**.
5. Se descargará un archivo `.json` a tu ordenador. **¡Guárdalo bien!**

## 5. Configurar la Aplicación
Abre el archivo `.json` descargado con un editor de texto (Notepad, VS Code). Necesitamos copiar dos valores al archivo `.env.local` de nuestro proyecto:

- `client_email` -> Copia este valor a `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` -> Copia TODO el valor (incluyendo `-----BEGIN PRIVATE KEY...`) a `GOOGLE_PRIVATE_KEY`

## 6. Compartir la Hoja de Cálculo
1. Crea una nueva hoja en Google Sheets (o usa una existente).
2. Dale al botón **Share** (Compartir) arriba a la derecha.
3. Copia el `client_email` de tu Service Account (paso 3 o del JSON) y pégalo allí. Asegúrate de que tenga permisos de **Editor**.
4. Copia el ID de la hoja de la URL. La URL se ve así:
   `https://docs.google.com/spreadsheets/d/ID_DE_LA_HOJA/edit...`
   Copia esa parte larga (`ID_DE_LA_HOJA`) y pégala en `GOOGLE_SHEET_ID` en `.env.local`.

¡Listo! La aplicación ahora podrá escribir en esa hoja.
