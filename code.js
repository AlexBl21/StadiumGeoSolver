document.addEventListener('DOMContentLoaded', () => {
    const calculateButton = document.getElementById('calculate');
    const clearButton = document.getElementById('clear');
    const formulario = document.getElementById('formulario');

    calculateButton.addEventListener('click', (e) => {
        e.preventDefault();
        calcularLlenadoEstadio();
    });

    clearButton.addEventListener('click', (e) => {
        e.preventDefault();
        limpiarFormulario();
    });

    function calcularLlenadoEstadio() {
        // Obtener los valores de los inputs
        const capacidad = parseFloat(document.getElementById('capacidad').value);
        const tasaLlegadaInicial = parseFloat(document.getElementById('tasaLlegadaInicial').value);
        const tasaLlegadaFinal = parseFloat(document.getElementById('tasaLlegadaFinal').value);
        const tiempoEntrada = parseFloat(document.getElementById('tiempoEntrada').value);
        const factorDecaimiento = parseFloat(document.getElementById('fDeacimiento').value);
        const nPuertas = parseInt(document.getElementById('nPuertas').value);

        // Calcular la ecuación diferencial del tiempo de llenado del estadio
        // Tasa de cambio de la llegada de personas
        const lambda_t = (t) => tasaLlegadaInicial * Math.exp(-factorDecaimiento * t) + tasaLlegadaFinal;

        // Integrar la tasa de cambio para encontrar el tiempo total de llenado
        let tiempoLlenado = 0;
        let integral = 0;
        const dt = 0.1; // Aumentar el intervalo de tiempo para hacer la simulación más rápida

        while (integral < capacidad) {
            integral += lambda_t(tiempoLlenado) * dt;
            tiempoLlenado += dt;
        }

        // Expandir el section del formulario al doble de su ancho
        formulario.style.width = '80%';
        formulario.style.margin = '15px';

        // Limpiar el contenido del formulario
        formulario.innerHTML = '';

        // Crear las tarjetas de resultados
        const resultsHTML = `
            <h2 class="text-xl mb-4">Resultados</h2>
            <div class="grid grid-cols-2 gap-4">
                <div class="card bg-white p-4 mb-4 rounded-lg shadow-md">
                    <h3 class="font-bold">Ecuación Diferencial:</h3>
                    <p class="mt-2">dP/dt = λ(t) = ${tasaLlegadaInicial} * exp(-${factorDecaimiento} * t) + ${tasaLlegadaFinal}</p>
                </div>
                <div class="card bg-white p-4 mb-4 rounded-lg shadow-md">
                    <h3 class="font-bold">Capacidad del estadio (C):</h3>
                    <p class="mt-2">${capacidad}</p>
                </div>
                <div class="card bg-white p-4 mb-4 rounded-lg shadow-md">
                    <h3 class="font-bold">Tasa de Llegada Inicial (λ0):</h3>
                    <p class="mt-2">${tasaLlegadaInicial}</p>
                </div>
                <div class="card bg-white p-4 mb-4 rounded-lg shadow-md">
                    <h3 class="font-bold">Tasa de Llegada Final (λf):</h3>
                    <p class="mt-2">${tasaLlegadaFinal}</p>
                </div>
                <div class="card bg-white p-4 mb-4 rounded-lg shadow-md">
                    <h3 class="font-bold">Tiempo de Entrada (T):</h3>
                    <p class="mt-2">${tiempoEntrada}</p>
                </div>
                <div class="card bg-white p-4 mb-4 rounded-lg shadow-md">
                    <h3 class="font-bold">Factor de Decaimiento (k):</h3>
                    <p class="mt-2">${factorDecaimiento}</p>
                </div>
                <div class="card bg-white p-4 mb-4 rounded-lg shadow-md">
                    <h3 class="font-bold">Número de Puertas (P):</h3>
                    <p class="mt-2">${nPuertas}</p>
                </div>
                <div class="card bg-white p-4 mb-4 rounded-lg shadow-md">
                    <h3 class="font-bold">Tiempo de Llenado del Estadio:</h3>
                    <p class="mt-2">${tiempoLlenado.toFixed(2)} minutos</p>
                </div>
                <div class="card bg-white p-4 mb-4 rounded-lg shadow-md">
                    <h3 class="font-bold">Simulación del Llenado:</h3>
                    <div class="simulacion-llenado">
                        <div id="stadium-simulation" style="position: relative; width: 100%; height: 100px; background: #e0e0e0;">
                            <div id="stadium-fill" style="position: absolute; bottom: 0; width: 100%; height: 0; background: #76c7c0;"></div>
                        </div>
                    </div>
                </div>
            </div>
            <canvas id="graph" class="bg-white p-4 rounded-lg shadow-md"></canvas>
        `;

        // Insertar el HTML de los resultados
        formulario.innerHTML = resultsHTML;

        // Crear la gráfica usando Chart.js
        const ctx = document.getElementById('graph').getContext('2d');
        const labels = [];
        const data = [];
        let t = 0;

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tasa de Llegada (λ(t))',
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tiempo (minutos)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Tasa de Llegada (personas/minuto)'
                        }
                    }
                }
            }
        });

        // Simular el llenado del estadio y construir la gráfica
        let integralSim = 0;
        const simulationDuration = 1000; // <---- MODIFICA ESTE VALOR
        const steps = Math.ceil(simulationDuration / dt); // Número de pasos en la simulación
        const intervalTime = simulationDuration / steps; // Tiempo entre cada paso

        const interval = setInterval(() => {
            if (integralSim >= capacidad || t >= tiempoLlenado) {
                clearInterval(interval);
                return;
            }
            integralSim += lambda_t(t) * dt;
            labels.push(t.toFixed(2));
            data.push(lambda_t(t));
            chart.update();

            // Actualizar la simulación del llenado del estadio
            const fillPercentage = (integralSim / capacidad) * 100;
            document.getElementById('stadium-fill').style.height = `${fillPercentage}%`;

            t += dt;
        }, intervalTime);
    }

    function limpiarFormulario() {
        document.getElementById('capacidad').value = '';
        document.getElementById('tasaLlegadaInicial').value = '';
        document.getElementById('tasaLlegadaFinal').value = '';
        document.getElementById('tiempoEntrada').value = '';
        document.getElementById('fDeacimiento').value = '';
        document.getElementById('nPuertas').value = '';

        // Limpiar el contenido del formulario y restablecer el ancho
        const formulario = document.getElementById('formulario');
        formulario.innerHTML = '';
        formulario.style.width = '100%';
    }
});
