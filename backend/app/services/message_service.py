from app.repository.message_repository import MessageRepository
from app.services.base_service import BaseService
from app.schema.message_schema import UpsertMessage, Message
from fastapi.responses import StreamingResponse
from fastapi import BackgroundTasks
from ollama import chat
import json

class MessageService(BaseService):
    def __init__(self, message_repository: MessageRepository):
        self.message_repository = message_repository
        super().__init__(message_repository)

    def get_all_by_thread_id(self, thread_id: int):
        data = self.message_repository.get_all_by_thread_id(thread_id)
        return data
    
    async def chat(self, schema: UpsertMessage):
        # client = Ollama()
        schema.sender = "user"

        system_prompt = """
Eres un asistente especializado en bases de datos, consultas SQL y diseño de sistemas. 
Tu propósito es asistir a los usuarios con explicaciones claras, optimización de consultas, 
resolución de problemas en bases de datos y proporcionar materiales educativos relevantes.

Instrucciones específicas:
- **Conceptos básicos:** Proporciona definiciones claras y concisas sobre términos y principios fundamentales de bases de datos. Siempre incluye enlaces a recursos adicionales para facilitar el aprendizaje.
- **Consultas SQL intermedias y avanzadas:** Ayuda a los usuarios a comprender y escribir consultas SQL más complejas, identifica errores en su código y sugiere optimizaciones para mejorar el rendimiento.
- **Resolución de problemas:** Ofrece pasos detallados y estructurados para diagnosticar y solucionar problemas relacionados con bases de datos, asegurando claridad y precisión en las explicaciones.
- **Materiales educativos:** Según la naturaleza de la consulta, sugiere recursos educativos específicos que puedan ayudar al usuario a mejorar su comprensión o habilidades en el tema consultado.

Tu objetivo principal es brindar soporte efectivo y adaptado a las necesidades del usuario, asegurando siempre claridad y utilidad en tus respuestas.
"""
        
        resources = """
        ### Recursos sobre SQL Server y Transact-SQL

        #### **1. Creación, administración y eliminación de bases de datos**
        - **[Crear una base de datos](https://learn.microsoft.com/es-es/sql/relational-databases/databases/create-a-database?view=sql-server-ver16)**  
        Proceso para crear bases de datos con SQL Server Management Studio (SSMS) o Transact-SQL.
        - **[Eliminar una base de datos](https://learn.microsoft.com/es-es/sql/relational-databases/databases/delete-a-database?view=sql-server-ver16)**  
        Instrucciones para eliminar bases de datos definidas por el usuario mediante SSMS o Transact-SQL.
        - **[Base de datos model](https://learn.microsoft.com/es-es/sql/relational-databases/databases/model-database?view=sql-server-ver16)**  
        Explicación sobre el uso de la base de datos modelo como plantilla para crear nuevas bases de datos.
        - **[Desinstalar una instancia de SQL Server](https://learn.microsoft.com/es-es/sql/sql-server/install/uninstall-an-existing-instance-of-sql-server-setup?view=sql-server-ver16&tabs=Windows10)**  
        Pasos para desinstalar una instancia de SQL Server.

        ---

        #### **2. Consultas y manipulación de datos**
        - **[Consultas básicas de SQL](https://www.unir.net/revista/marketing-comunicacion/consultas-sql/)**  
        Introducción a las operaciones más comunes, como creación, modificación y eliminación de datos.
        - **[Usar SELECT para recuperar filas y columnas](https://learn.microsoft.com/es-es/sql/t-sql/queries/select-examples-transact-sql?view=sql-server-ver16)**  
        Ejemplos de consultas SELECT para recuperar datos de tablas.
        - **[Consultas DML en SQL Server](https://learn.microsoft.com/es-es/sql/t-sql/queries/queries?view=sql-server-ver16)**  
        Uso del lenguaje de manipulación de datos para trabajar con datos en SQL Server.
        - **[Insertar, actualizar y eliminar registros](https://learn.microsoft.com/es-es/office/vba/access/concepts/structured-query-language/insert-update-and-delete-records-from-a-table-using-access-sql)**  
        Métodos para agregar, modificar y eliminar registros en tablas usando SQL.

        ---

        #### **3. Relaciones y estructuras de tablas**
        - **[Crear relaciones de claves externas](https://learn.microsoft.com/es-es/sql/relational-databases/tables/create-foreign-key-relationships?view=sql-server-ver16)**  
        Cómo asociar filas entre tablas mediante claves externas.
        - **[Eliminar todas las tablas de una base de datos](https://infoinnova.net/2013/09/t-sql-eliminar-todas-las-tablas-de-una-base-de-datos/)**  
        Procedimiento para borrar todas las tablas en una base de datos SQL Server.
        - **[Eliminación de columnas de una tabla](https://learn.microsoft.com/es-es/sql/relational-databases/tables/delete-columns-from-a-table?view=sql-server-ver16)**  
        Restricciones y pasos para eliminar columnas en tablas.

        ---

        #### **4. Índices y funciones**
        - **[Eliminación de un índice](https://learn.microsoft.com/es-es/sql/relational-databases/indexes/delete-an-index?view=sql-server-ver16)**  
        Proceso para eliminar índices mediante SSMS o Transact-SQL.
        - **[Funciones en SQL Server](https://learn.microsoft.com/es-es/sql/t-sql/functions/functions?view=sql-server-ver16)**  
        Información sobre funciones integradas y cómo crear funciones personalizadas.
        - **[Funciones de agregación](https://www.youtube.com/watch?v=VZrqJYpm-cY)**  
        Uso de funciones como AVG, SUM y COUNT para obtener valores agregados en consultas.

        ---

        #### **5. Tipos de datos y atributos de tablas**
        - **[Tipos de datos en SQL Server](https://sqlearning.com/es/introduccion-sql-server/tipos-datos/)**  
        Categorías y uso de tipos de datos en Transact-SQL.
        - **[Atributos de detalle de tabla](https://www.ibm.com/docs/es/tcamfma/6.3.0?topic=group-ms-sql-table-detail-attributes)**  
        Información sobre los atributos de detalle utilizados para supervisar tablas en SQL Server.

        ---

        #### **6. Seguridad y transacciones**
        - **[Clasificación y detección de datos de SQL](https://learn.microsoft.com/es-es/sql/relational-databases/security/sql-data-discovery-and-classification?view=sql-server-ver16&tabs=t-sql)**  
        Funcionalidades para identificar y proteger información sensible en bases de datos.
        - **[Transacciones en Transact-SQL](https://learn.microsoft.com/es-es/sql/t-sql/language-elements/transactions-transact-sql?view=sql-server-ver16)**  
        Explicación sobre el manejo de transacciones para garantizar integridad en las operaciones.



        ### Recursos sobre SQL y Bases de Datos

        #### **1. Introducción y tutoriales básicos**
        - **[Tutorial de SQL Básico](https://www.w3schools.com/sql/)**  
        Introducción al lenguaje SQL con ejemplos prácticos y ejercicios interactivos.
        - **[Introducción a Bases de Datos](https://www.khanacademy.org/computing/computer-programming/sql)**  
        Curso gratuito que cubre los fundamentos de SQL y bases de datos.

        ---

        #### **2. Consultas y técnicas avanzadas**
        - **[Consultas Avanzadas en SQL](https://www.sqltutorial.org/sql-advanced/)**  
        Guía para aprender comandos y técnicas avanzadas en SQL, como subconsultas y vistas.
        - **[Optimización de Consultas](https://use-the-index-luke.com/)**  
        Tutorial práctico enfocado en mejorar el rendimiento de consultas mediante el uso de índices y buenas prácticas.

        ---

        #### **3. Diseño y normalización**
        - **[Diseño y Normalización de Bases de Datos](https://www.databasedesign.com/)**  
        Principios clave para diseñar bases de datos eficientes, con enfoque en normalización y relaciones.
        """

        conversation = [
            {"role": "system", "content": system_prompt},
            {"role": "system", "content": "Material educativo adicional disponible:\n" + resources},
        ]

        conversation.append({"role": "user", "content": schema.content})

        schema.sender = "user"
        self.add(schema)

        stream  = chat(
            model='llama3.2',
            messages=conversation,
            stream=True,
        )

        assistant_response_parts = []
        async def message_generator():
            for chunk in stream:
                message_content = chunk.get("message", {}).get("content", "")
                if message_content:
                    assistant_response_parts.append(message_content)
                    yield f"data: {json.dumps({'v': message_content})}\n\n"

        response = StreamingResponse(message_generator(), media_type="text/event-stream")

        tasks = BackgroundTasks()
        tasks.add_task(self._save_assistant_response, schema, assistant_response_parts)

        response.background = tasks

        return response


    async def _save_assistant_response(self, schema: UpsertMessage, assistant_response_parts: list):
        assistant_response = "".join(assistant_response_parts)

        schema.sender = "assistant"
        schema.content = assistant_response
        self.add(schema)
