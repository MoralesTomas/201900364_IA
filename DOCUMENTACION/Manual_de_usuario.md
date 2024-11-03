# Manual de usuario

| Nombre | Carné |
| --- | --- |
| Tomas Morales | 201900364 |

---

# PLANTEAMIENTO DEL PROBLEMA

Practicar los conceptos de Machine Learning mediante el uso de la biblioteca tytus.js creando
un sitio Web con Pages de GitHub, JavaScript y HTML.

Descripción

Se debe crear un sitio Web con los siguientes componentes:
– Seleccionador de archivos de entrada del tipo CSV o DataSets.
– Seleccionador de algoritmos o modelos de Machine Learning disponibles:
– Parametrización:

o Porcentaje de train data y test data
o Objetivo del entrenamiento (tendencias, patrones, clasificación, predicción, etc.)
o Argumentos específicos para configurar la instancia del modelo
o Si fuera predicción permitir el ingreso del nuevo rango en el eje x.
o Si fuera una clasificación permitir el ingreso de la cantidad de clases.
o Si fuera un aprendizaje supervisado, la selección de las variables de entrada y de la variable de salida del DataSet.
o Cualquier otro parámetro necesario para el modelo.

– Botones para las siguientes operaciones:

o Entrenamiento
o Predicción
o Mostrar gráficas
o Cualquier otra operación necesaria.

Bibliotecas permitidas

Para la instancia de los modelos como para entrenamiento y predicción se debe utilizar la siguiente biblioteca:
[https://github.com/tytusdb/tytusjs/blob/main/dist/tytus.js](https://github.com/tytusdb/tytusjs/blob/main/dist/tytus.js)

---

# Solución general

Para poder dar solución al problema presentado se realizo el diseño de una interfaz intuitiva y de fácil uso, se realizaron componentes visuales que serán de gran ayuda al momento de poder analizar los resultados.

---

# Uso del sitio

![Combobox para la seleccion del algoritmo](image.png)

Combobox para la seleccion del algoritmo

![image.png](MANUAL_USUARIO/image%201.png)

![image.png](MANUAL_USUARIO/image%202.png)

![image.png](MANUAL_USUARIO/image%203.png)

Modelo ya ajustado y valores obtenidos mostrados en apartado.

# Ejemplo de archivo ingresado

![image.png](MANUAL_USUARIO/image%204.png)

---

# Datos aceptados

En la solucion de este problema se han dejado varios archivos de prueba para que se puedan evaluar los datos que acepta cada modelo, adicional a ello se dejo el enlace a la libreria que se utilizo como solucion, asi que ahi tambien se puede evaluar el formato de entrada.

 

---

# Modelos

### Regresion lineal

![image.png](MANUAL_USUARIO/image%205.png)

### Regresion polinomial

![image.png](MANUAL_USUARIO/image%206.png)

### Arbol de decision

![image.png](MANUAL_USUARIO/image%207.png)

### Red neuronal

![image.png](MANUAL_USUARIO/image%208.png)

### K-Means

![image.png](MANUAL_USUARIO/image%209.png)