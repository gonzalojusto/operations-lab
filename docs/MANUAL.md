# Manual de Usuario — Operations Lab

**Build Better Operations**
`https://gonzalojusto.github.io/operations-lab/`

---

## Qué es Operations Lab

Operations Lab es una suite de 8 herramientas gratuitas para PYMEs que
quieren entender y mejorar sus operaciones — inventario, KPIs, procesos,
capacidad y planificación — sin necesidad de un ERP, una consultora, ni una
cuenta.

**Principio de diseño más importante: todo ocurre en tu navegador.** No hay
login, no hay servidores, no hay base de datos. Cuando subes un archivo CSV,
se analiza en tu propio ordenador — nunca viaja a ningún sitio. Cuando un
módulo guarda datos (KPI Pulse, Process Mapper, Capacity Planner), se
guardan en el almacenamiento local de tu navegador (`localStorage`): si
cambias de navegador o de ordenador, no los verás — y si borras el caché del
navegador, se pierden.

---

## Índice

1. [Operations Score](#1-operations-score)
2. [Inventory Analyzer](#2-inventory-analyzer)
3. [Dead Stock Manager](#3-dead-stock-manager)
4. [SmartSlot Lite](#4-smartslot-lite)
5. [KPI Pulse](#5-kpi-pulse)
6. [Process Mapper](#6-process-mapper)
7. [Capacity Planner](#7-capacity-planner)
8. [Operations BI](#8-operations-bi)

---

## 1. Operations Score

**Qué hace:** un diagnóstico completo de la madurez operativa de tu empresa
en menos de 5 minutos.

**Cómo usarlo:**
1. Ve a **Operations Score** desde la Home o el menú lateral.
2. **Paso 1 — Datos de la empresa**: nombre, sector, nº de empleados, si
   tienes almacén, si usas ERP/Excel, país. Solo nombre y sector son
   obligatorios para avanzar.
3. **Paso 2 — 15 preguntas**: responde cada una en una escala de 0 (no
   existe) a 5 (excelente). Cubren Procesos, KPIs, Inventario, Tecnología,
   Gestión Operativa y Mejora Continua.
4. **Paso 3 — Datos reales (opcional)**: puedes subir hasta 3 archivos CSV
   (`inventario.csv`, `pedidos.csv`, `incidencias.csv`) para que el
   diagnóstico sea más preciso. Es opcional — puedes saltarlo.
5. **Resultado**: score global (0-100), nivel de madurez, radar por
   categoría, riesgos detectados, 5 quick wins priorizados, ahorro
   potencial estimado y un roadmap a 30/90/180 días.

**En el resultado puedes:**
- **Descargar un PDF** de 8 páginas con todo el informe (botón "Descargar
  informe PDF").
- **Compartir el resultado** con un enlace (botón "Compartir resultado") —
  quien lo abra verá tu diagnóstico recalculado en su propio navegador, sin
  que tus datos pasen por ningún servidor.
- **Contactar** directamente si quieres ayuda para interpretar los
  resultados (abre un email pre-rellenado con el resumen).

> Cada vez que completas un diagnóstico, queda guardado en tu navegador y
> alimenta automáticamente **Operations BI** (módulo 8).

---

## 2. Inventory Analyzer

**Qué hace:** análisis avanzado de tu inventario: clasificación ABC, salud
general, duplicados y posible exceso de stock.

**Cómo usarlo:**
1. Prepara un archivo `inventario.csv` con estas columnas (los nombres son
   flexibles, el sistema detecta variantes habituales):
   - **SKU** / referencia / código
   - **Stock** / cantidad / unidades
   - **Última venta** / fecha de última venta *(opcional pero recomendado)*
   - **Valor** / coste / precio *(opcional — si no lo aportas, se usa el
     stock como proxy de valor)*
2. Súbelo en la pantalla de Inventory Analyzer.
3. Verás: nº de SKUs, % de dead stock, duplicados detectados, posible
   exceso, un indicador de "Inventory Health" (0-100), el desglose ABC en
   un gráfico de donut, y dos tablas: top referencias por valor
   inmovilizado y posible exceso de stock.

**Nota:** este mismo análisis alimenta también Dead Stock Manager — puedes
reutilizar el mismo archivo en ambos módulos.

---

## 3. Dead Stock Manager

**Qué hace:** aísla específicamente el stock obsoleto (sin ventas en más de
90 días) y cuánto capital tienes atrapado en él.

**Cómo usarlo:**
1. Sube el mismo `inventario.csv` que en Inventory Analyzer.
2. Verás: nº de referencias en dead stock, valor inmovilizado en euros, %
   que representa sobre el valor total del inventario, y una tabla completa
   de las referencias afectadas ordenadas por valor.
3. Si hay dead stock, aparece un **plan de liquidación sugerido** con 3
   pasos concretos: priorizar por valor, canales de salida rápida, y
   revisar el proceso de compra que lo generó.

---

## 4. SmartSlot Lite

**Qué hace:** sugiere qué referencias colocar más cerca de la zona de
expedición para reducir el tiempo de picking (slotting por zonas).

**Cómo usarlo:**
1. Prepara un archivo `picking.csv` con dos columnas: **SKU** y
   **frecuencia** (nº de veces que se ha hecho picking de esa referencia en
   el periodo que quieras analizar).
2. Súbelo. El sistema aplica la regla de concentración 80/95 (la misma
   lógica que el análisis ABC, pero aplicada a frecuencia de picking en vez
   de a valor).
3. Verás un mapa visual del almacén con 3 zonas (A = oro, cerca de
   expedición; B = plata; C = bronce, fondo del almacén) y una tabla con la
   zona recomendada para cada SKU.

---

## 5. KPI Pulse

**Qué hace:** seguimiento continuo de tus KPIs operativos, con histórico y
alertas. **Este módulo guarda datos en tu navegador (localStorage).**

**Cómo usarlo:**
1. Al entrar por primera vez verás 5 KPIs preconfigurados: OTIF, Exactitud
   de Inventario, Rotación de Inventario, Coste por Pedido y Tiempo Medio
   de Picking, cada uno con un target de referencia.
2. Para registrar un valor, escribe el número en el campo de cada tarjeta y
   pulsa "Registrar" — queda guardado con la fecha de hoy.
3. Cada KPI muestra su estado: **On Track** (cumple target), **At Risk**
   (dentro del 10% de desviación), **Off Track** (más del 10% de
   desviación), o **Sin datos**.
4. Puedes **añadir tus propios KPIs** con el botón "Añadir KPI
   personalizado" — define nombre, unidad, target y si mayor o menor es
   mejor.
5. Si algún KPI está Off Track, aparece un aviso arriba de la página.

> Como los datos viven en tu navegador, si quieres llevar un seguimiento
> real a lo largo de semanas, entra desde el mismo navegador y ordenador
> cada vez (o exporta manualmente tus registros si necesitas respaldo).

---

## 6. Process Mapper

**Qué hace:** documenta procesos operativos paso a paso, de forma visual.
**Guarda datos en tu navegador (localStorage).**

**Cómo usarlo:**
1. Rellena el formulario de la derecha: nombre del paso (obligatorio),
   descripción (opcional) y responsable (opcional).
2. Pulsa "Añadir paso" — aparece conectado visualmente al paso anterior con
   una flecha.
3. Usa las flechas ▲▼ de cada tarjeta para reordenar los pasos, o la
   papelera para eliminarlos.
4. No hay límite de pasos ni de procesos — puedes documentar varios
   procesos seguidos (aunque hoy todos comparten la misma lista; si quieres
   separar procesos distintos, usa un prefijo en el título, p.ej. "Recepción
   1: ...").

---

## 7. Capacity Planner

**Qué hace:** calcula si tu plantilla actual cubre la demanda esperada,
incluyendo picos por día de la semana. **Guarda datos en tu navegador.**

**Cómo usarlo:**
1. Ajusta los 4 parámetros de la izquierda:
   - **Pedidos/día (media)**
   - **Minutos por pedido**
   - **Horas disponibles por empleado y día**
   - **Empleados actuales**
2. Ajusta el **multiplicador de demanda por día de la semana** con los
   deslizadores (1.0 = demanda media; súbelo en los días de más carga, como
   viernes o sábado en ecommerce).
3. Verás al instante: empleados necesarios, % de utilización de la
   capacidad actual, el gap (positivo = faltan personas), y un gráfico de
   barras comparando horas requeridas vs. disponibles por día.

---

## 8. Operations BI

**Qué hace:** vista consolidada que combina el histórico de tus
diagnósticos de Operations Score con el estado actual de tus KPIs de KPI
Pulse. Se construye automáticamente — no requiere ninguna acción por tu
parte más allá de usar los otros dos módulos.

**Cómo usarlo:**
1. Simplemente entra en el módulo. Si nunca has hecho un Operations Score
   en este navegador, verás un aviso invitándote a hacer el primero.
2. Si ya tienes al menos un diagnóstico guardado, verás: nº de diagnósticos
   realizados, tu último score, la evolución desde el primer diagnóstico
   (si has hecho más de uno), y un gráfico de la evolución del score en el
   tiempo.
3. Debajo, un resumen de tus KPIs de KPI Pulse por estado (On Track / At
   Risk / Off Track / Sin datos), con un enlace directo a KPI Pulse.

> Cuantos más diagnósticos de Operations Score hagas a lo largo del tiempo
> (por ejemplo, uno cada trimestre), más útil será este gráfico de
> evolución.

---

## Preguntas frecuentes

**¿Necesito crear una cuenta?**
No. No hay login en ningún módulo.

**¿Mis datos se envían a algún servidor?**
No. Todo el procesamiento (CSVs, cálculos, PDF) ocurre en tu navegador. Los
únicos datos que "salen" de tu navegador son los que tú decides compartir
explícitamente: el enlace de "Compartir resultado" (que codifica tus
respuestas en la propia URL) o el email de contacto.

**¿Por qué no veo mis KPIs/procesos si cambio de ordenador?**
Porque se guardan en `localStorage`, que es local a cada navegador. Es una
decisión de diseño para no necesitar backend ni cuenta — la contrapartida es
que no hay sincronización entre dispositivos.

**¿Puedo borrar mis datos guardados?**
Sí — borrando los datos de navegación/localStorage de tu navegador para ese
sitio (en Chrome: Configuración → Privacidad → Borrar datos de navegación,
seleccionando "Datos de sitios").

**¿Qué pasa si mi CSV no tiene exactamente esas columnas?**
El sistema intenta detectar variantes habituales de nombres de columna
(español/inglés, con/sin tildes). Si no encuentra una columna esperada, te
avisa con un mensaje y sigue funcionando con la información disponible.

---

*Manual generado para Operations Lab. Para dudas o sugerencias:
gonzalo.justo@gmail.com*
