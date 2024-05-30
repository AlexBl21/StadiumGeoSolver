document.addEventListener("DOMContentLoaded", function() {
    const elipticForm = document.querySelector("#elipticForm");
    const rectangularForm = document.querySelector("#rectangularForm");

    // Función para manejar el formulario del estadio elíptico
    if (elipticForm) {
        const calculateButton = elipticForm.querySelector("#calculateEliptic");
        const clearButton = elipticForm.querySelector("#clearEliptic");

        calculateButton.addEventListener("click", function(event) {
            event.preventDefault();
            const a = parseFloat(document.querySelector("#elipticA").value);
            const b = parseFloat(document.querySelector("#elipticB").value);
            if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
                alert("Por favor, ingresa valores válidos y positivos para los ejes.");
                return;
            }
            showElipticEquation(a, b);
        });

        clearButton.addEventListener("click", function(event) {
            event.preventDefault();
            document.querySelector("#elipticA").value = '';
            document.querySelector("#elipticB").value = '';
        });
    }

    // Función para manejar el formulario del estadio rectangular con bordes curvos
    if (rectangularForm) {
        const calculateButton = rectangularForm.querySelector("#calculateRectangular");
        const clearButton = rectangularForm.querySelector("#clearRectangular");

        calculateButton.addEventListener("click", function(event) {
            event.preventDefault();
            const L = parseFloat(document.querySelector("#rectangularL").value);
            const W = parseFloat(document.querySelector("#rectangularW").value);
            const R = parseFloat(document.querySelector("#rectangularR").value);
            if (isNaN(L) || isNaN(W) || isNaN(R) || L <= 0 || W <= 0 || R <= 0) {
                alert("Por favor, ingresa valores válidos y positivos para las dimensiones.");
                return;
            }
            showRectangularEquation(L, W, R);
        });

        clearButton.addEventListener("click", function(event) {
            event.preventDefault();
            document.querySelector("#rectangularL").value = '';
            document.querySelector("#rectangularW").value = '';
            document.querySelector("#rectangularR").value = '';
        });
    }

    function showElipticEquation(a, b) {
        const container = document.querySelector("#elipticFormContainer");
        container.innerHTML = `
            <h1 class="text-2xl">Ecuación Diferencial del Estadio Elíptico</h1>
            <p class="text-xl">Ecuación: (x^2 / ${a}^2) + (y^2 / ${b}^2) = 1</p>
            <canvas id="elipticChart" width="400" height="400"></canvas>
        `;
        renderElipticChart(a, b);
    }

    function showRectangularEquation(L, W, R) {
        const container = document.querySelector("#rectangularFormContainer");
        container.innerHTML = `
            <h1 class="text-2xl">Ecuación Diferencial del Estadio Rectangular con Bordes Curvos</h1>
            <p class="text-xl">Ecuación: (x^2 / ${R}^2) + (y^2 / ${R}^2) = 1, y otras ecuaciones para las secciones rectas y los semicírculos</p>
            <canvas id="rectangularChart" width="400" height="400"></canvas>
        `;
        renderRectangularChart(L, W, R);
    }

    function renderElipticChart(a, b) {
        const ctx = document.getElementById('elipticChart').getContext('2d');
        const data = [];
        for (let x = -a; x <= a; x += 0.1) {
            const y = Math.sqrt(b * b * (1 - (x * x) / (a * a)));
            data.push({x, y});
            data.push({x, y: -y});
        }
        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Estadio Elíptico',
                    data: data,
                    showLine: true,
                    borderColor: 'red',
                    backgroundColor: 'red',
                }]
            },
            options: {
                scales: {
                    x: { type: 'linear', position: 'bottom' },
                    y: { type: 'linear' }
                }
            }
        });
    }

    function renderRectangularChart(L, W, R) {
        const ctx = document.getElementById('rectangularChart').getContext('2d');
        const data = [];
        for (let x = -L / 2; x <= L / 2; x += 0.1) {
            if (Math.abs(x) > (L / 2 - R)) {
                const y = Math.sqrt(R * R - Math.pow(Math.abs(x) - L / 2 + R, 2));
                data.push({x, y});
                data.push({x, y: -y});
            } else {
                data.push({x, y: W / 2});
                data.push({x, y: -W / 2});
            }
        }
        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Estadio Rectangular con Bordes Curvos',
                    data: data,
                    showLine: true,
                    borderColor: 'blue',
                    backgroundColor: 'blue',
                }]
            },
            options: {
                scales: {
                    x: { type: 'linear', position: 'bottom' },
                    y: { type: 'linear' }
                }
            }
        });
    }
});
