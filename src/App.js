import { useState, useEffect } from "react";

export default function App() {
  const [gastos, setGastos] = useState(() => {
    const saved = localStorage.getItem("gastos");
    return saved ? JSON.parse(saved) : [];
  });
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("gasolina");
  const ingresoMensual = 1364;
  const ahorroMensual = 400;
  const [cuentaCorriente, setCuentaCorriente] = useState(415);
  const [cuentaAhorro, setCuentaAhorro] = useState(6700);
  const [mesActual, setMesActual] = useState(new Date().getMonth());

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  useEffect(() => {
    const hoy = new Date();
    if (hoy.getDate() === 1 && hoy.getMonth() !== mesActual) {
      setCuentaCorriente(prev => prev + ingresoMensual - ahorroMensual);
      setCuentaAhorro(prev => prev + ahorroMensual);
      setMesActual(hoy.getMonth());
    }
  }, [mesActual]);

  const agregarGasto = () => {
    if (!monto || isNaN(monto)) return;
    const nuevoGasto = {
      id: Date.now(),
      monto: parseFloat(monto),
      categoria,
      fecha: new Date().toLocaleDateString(),
    };
    setGastos([nuevoGasto, ...gastos]);
    setCuentaCorriente(prev => prev - parseFloat(monto));
    setMonto("");
  };

  const eliminarGasto = (id, monto) => {
    setGastos(gastos.filter(g => g.id !== id));
    setCuentaCorriente(prev => prev + monto);
  };

  const totalGastos = gastos.reduce((acc, g) => acc + g.monto, 0);
  const ahorroProyectado = cuentaAhorro;

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10 font-inter">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-blue-700">💼 Control de Gastos</h1>
          <p className="text-gray-500 mt-2">Gestiona tus finanzas personales con estilo</p>
        </header>

        <section className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">➕ Añadir Gasto</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <input
              type="number"
              placeholder="Monto (€)"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="gasolina">🚗 Gasolina</option>
              <option value="ropa">👕 Ropa</option>
              <option value="ocio">🎉 Ocio</option>
              <option value="otros">📦 Otros</option>
            </select>
            <button
              onClick={agregarGasto}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Agregar
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-600 font-medium mb-1">Cuenta Corriente</h3>
            <p className="text-2xl font-bold text-blue-600">€{cuentaCorriente.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-600 font-medium mb-1">Cuenta de Ahorro</h3>
            <p className="text-2xl font-bold text-green-600">€{cuentaAhorro.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-600 font-medium mb-1">Total Gastos</h3>
            <p className="text-xl text-red-500">€{totalGastos.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-600 font-medium mb-1">Ahorro Proyectado</h3>
            <p className="text-xl text-emerald-600">€{ahorroProyectado.toFixed(2)} / €15000</p>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">📅 Historial de Gastos</h2>
          {gastos.length === 0 ? (
            <p className="text-gray-500">Sin gastos registrados.</p>
          ) : (
            <ul className="divide-y">
              {gastos.map((g) => (
                <li
                  key={g.id}
                  className="flex justify-between items-center py-3 text-gray-700"
                >
                  <div>
                    <p className="font-medium">{g.fecha} - {g.categoria}</p>
                    <p className="text-sm text-gray-500">€{g.monto.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => eliminarGasto(g.id, g.monto)}
                    className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
