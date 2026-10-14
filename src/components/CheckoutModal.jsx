
import { useState } from "react";

function CheckoutModal({ carrito, total, onClose, onConfirmar }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [metodoPago, setMetodoPago] = useState("contra-entrega");
  const [error, setError] = useState("");

  function procesarCompra(evento) {
    evento.preventDefault();
    setError("");

    if (carrito.length === 0) {
      setError("Tu carrito está vacío.");
      return;
    }

    const pedido = {
      numero: `TS-${Date.now().toString().slice(-8)}`,
      fecha: new Date().toLocaleString("es-PE"),
      cliente: {
        nombre: nombre.trim(),
        correo: correo.trim(),
        direccion: direccion.trim(),
      },
      metodoPago,
      productos: carrito.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
      })),
      total,
      estado: "Registrado - pago simulado",
    };

    onConfirmar(pedido);
  }

  return (
    <div className="fondo-modal" onClick={onClose}>
      <section
        className="modal modal-checkout"
        onClick={(evento) => evento.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-checkout"
      >
        <button
          type="button"
          className="cerrar-modal"
          onClick={onClose}
          aria-label="Cerrar formulario"
        >
          ×
        </button>

        <p className="etiqueta">ÚLTIMO PASO</p>
        <h2 id="titulo-checkout">Finalizar compra</h2>
        <p className="texto-secundario">
          Completa tus datos para registrar el pedido de demostración.
        </p>

        <form onSubmit={procesarCompra}>
          <label htmlFor="nombre">Nombre completo</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            placeholder="Ingresa tu nombre"
            autoComplete="name"
            minLength={2}
            required
          />

          <label htmlFor="correo">Correo electrónico</label>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
            placeholder="ejemplo@correo.com"
            autoComplete="email"
            required
          />

          <label htmlFor="direccion">Dirección de entrega</label>
          <textarea
            id="direccion"
            value={direccion}
            onChange={(evento) => setDireccion(evento.target.value)}
            placeholder="Ingresa la dirección"
            autoComplete="street-address"
            minLength={5}
            rows={3}
            required
          />

          <label htmlFor="metodo-pago">Método de pago simulado</label>
          <select
            id="metodo-pago"
            value={metodoPago}
            onChange={(evento) => setMetodoPago(evento.target.value)}
          >
            <option value="contra-entrega">
              Pago contra entrega (simulado)
            </option>
            <option value="transferencia">
              Transferencia (simulada)
            </option>
            <option value="tarjeta-demo">
              Tarjeta de demostración (sin cobro)
            </option>
          </select>

          <div className="checkout-resumen">
            <span>Total del pedido</span>
            <strong>S/ {total.toFixed(2)}</strong>
          </div>

          {error && <p className="mensaje-error">{error}</p>}

          <p className="aviso-demo">
            No ingreses datos bancarios reales. Este formulario no procesa
            pagos ni envía los datos a un servidor.
          </p>

          <button
            type="submit"
            className="boton boton-principal boton-comprar"
          >
            Confirmar pedido
          </button>

          <button
            type="button"
            className="boton boton-secundario boton-comprar"
            onClick={onClose}
          >
            Volver al carrito
          </button>
        </form>
      </section>
    </div>
  );
}

export default CheckoutModal;
