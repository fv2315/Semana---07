
import { useEffect, useMemo, useState } from "react";
import CheckoutModal from "./components/CheckoutModal";

const productosIniciales = [
  {
    id: 1,
    nombre: "Laptop Lenovo IdeaPad",
    categoria: "Computadoras",
    precio: 2199.9,
    emoji: "💻",
    descripcion: "Laptop para estudiar, trabajar y realizar tareas diarias.",
    stock: 10,
  },
  {
    id: 2,
    nombre: "Mouse inalámbrico",
    categoria: "Accesorios",
    precio: 59.9,
    emoji: "🖱️",
    descripcion: "Mouse inalámbrico cómodo y práctico.",
    stock: 25,
  },
  {
    id: 3,
    nombre: "Teclado mecánico RGB",
    categoria: "Accesorios",
    precio: 149.9,
    emoji: "⌨️",
    descripcion: "Teclado mecánico con iluminación RGB.",
    stock: 15,
  },
  {
    id: 4,
    nombre: "Audífonos Bluetooth",
    categoria: "Audio",
    precio: 119.9,
    emoji: "🎧",
    descripcion: "Audífonos inalámbricos para música y llamadas.",
    stock: 20,
  },
  {
    id: 5,
    nombre: "Monitor Full HD",
    categoria: "Computadoras",
    precio: 499.9,
    emoji: "🖥️",
    descripcion: "Monitor Full HD ideal para estudiar y trabajar.",
    stock: 8,
  },
  {
    id: 6,
    nombre: "Parlante portátil",
    categoria: "Audio",
    precio: 89.9,
    emoji: "🔊",
    descripcion: "Parlante portátil para escuchar música.",
    stock: 12,
  },
];

function App() {
  const [productos] = useState(productosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [orden, setOrden] = useState("nombre");
  const [carrito, setCarrito] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarCheckout, setMostrarCheckout] = useState(false);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [notificacion, setNotificacion] = useState("");
  const [ultimoPedido, setUltimoPedido] = useState(null);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", modoOscuro);

    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, [modoOscuro]);

  useEffect(() => {
    if (!notificacion) return;

    const temporizador = setTimeout(() => {
      setNotificacion("");
    }, 2500);

    return () => clearTimeout(temporizador);
  }, [notificacion]);

  const categorias = [
    "Todos",
    ...new Set(productos.map((producto) => producto.categoria)),
  ];

  const productosFiltrados = useMemo(() => {
    let resultado = productos.filter((producto) => {
      const coincideNombre = producto.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      const coincideCategoria =
        categoria === "Todos" || producto.categoria === categoria;

      return coincideNombre && coincideCategoria;
    });

    resultado = [...resultado];

    if (orden === "precio-menor") {
      resultado.sort((a, b) => a.precio - b.precio);
    } else if (orden === "precio-mayor") {
      resultado.sort((a, b) => b.precio - a.precio);
    } else {
      resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    return resultado;
  }, [productos, busqueda, categoria, orden]);

  const cantidadCarrito = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  const totalCarrito = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  function agregarAlCarrito(producto) {
    const cantidadActual =
      carrito.find((item) => item.id === producto.id)?.cantidad ?? 0;

    if (cantidadActual >= producto.stock) {
      setNotificacion("No hay más unidades disponibles.");
      return;
    }

    setCarrito((actual) => {
      const existe = actual.find((item) => item.id === producto.id);

      if (existe) {
        return actual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...actual, { ...producto, cantidad: 1 }];
    });

    setNotificacion(`${producto.nombre} agregado al carrito.`);
  }

  function cambiarCantidad(id, cambio) {
    setCarrito((actual) =>
      actual
        .map((item) => {
          if (item.id !== id) return item;

          const producto = productos.find((p) => p.id === id);
          const nuevaCantidad = item.cantidad + cambio;

          if (nuevaCantidad > (producto?.stock ?? 0)) {
            return item;
          }

          return { ...item, cantidad: nuevaCantidad };
        })
        .filter((item) => item.cantidad > 0)
    );
  }

  function eliminarDelCarrito(id) {
    setCarrito((actual) => actual.filter((item) => item.id !== id));
  }

  function alternarFavorito(id) {
    setFavoritos((actual) =>
      actual.includes(id)
        ? actual.filter((favorito) => favorito !== id)
        : [...actual, id]
    );
  }

  function confirmarPedido(pedido) {
    setUltimoPedido(pedido);
    setCarrito([]);
    setMostrarCheckout(false);
    setNotificacion(`Pedido ${pedido.numero} registrado correctamente.`);
  }

  return (
    <div className="app">
      <header className="encabezado">
        <a className="logo" href="#inicio">
          Tech<span>Store</span>
        </a>

        <nav className="navegacion">
          <a href="#inicio">Inicio</a>
          <a href="#productos">Productos</a>
          <a href="#carrito">Carrito ({cantidadCarrito})</a>
        </nav>

        <button
          className="boton boton-tema"
          onClick={() => setModoOscuro((actual) => !actual)}
          aria-label="Cambiar tema"
        >
          {modoOscuro ? "☀️ Modo claro" : "🌙 Modo oscuro"}
        </button>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div>
            <p className="etiqueta">TECNOLOGÍA A TU ALCANCE</p>
            <h1>Encuentra tu próximo dispositivo</h1>
            <p>
              Explora productos tecnológicos, agrega tus favoritos al carrito
              y realiza una compra de demostración.
            </p>
            <a className="boton boton-principal" href="#productos">
              Ver productos
            </a>
          </div>

          <div className="hero-icono" aria-hidden="true">
            🛍️
          </div>
        </section>

        <section className="seccion-productos" id="productos">
          <div className="titulo-seccion">
            <div>
              <p className="etiqueta">NUESTRO CATÁLOGO</p>
              <h2>Productos disponibles</h2>
            </div>
            <span>{productosFiltrados.length} productos</span>
          </div>

          <div className="controles">
            <input
              type="search"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              aria-label="Buscar productos"
            />

            <select
              value={categoria}
              onChange={(evento) => setCategoria(evento.target.value)}
              aria-label="Filtrar por categoría"
            >
              {categorias.map((nombreCategoria) => (
                <option key={nombreCategoria} value={nombreCategoria}>
                  {nombreCategoria}
                </option>
              ))}
            </select>

            <select
              value={orden}
              onChange={(evento) => setOrden(evento.target.value)}
              aria-label="Ordenar productos"
            >
              <option value="nombre">Ordenar por nombre</option>
              <option value="precio-menor">Precio: menor a mayor</option>
              <option value="precio-mayor">Precio: mayor a menor</option>
            </select>
          </div>

          <div className="rejilla-productos">
            {productosFiltrados.map((producto) => (
              <article className="tarjeta-producto" key={producto.id}>
                <button
                  className={`boton-favorito ${
                    favoritos.includes(producto.id) ? "es-favorito" : ""
                  }`}
                  onClick={() => alternarFavorito(producto.id)}
                  aria-label="Agregar o quitar de favoritos"
                >
                  {favoritos.includes(producto.id) ? "♥" : "♡"}
                </button>

                <button
                  className="producto-imagen"
                  onClick={() => setProductoSeleccionado(producto)}
                  aria-label={`Ver ${producto.nombre}`}
                >
                  {producto.emoji}
                </button>

                <div className="producto-contenido">
                  <span className="producto-categoria">
                    {producto.categoria}
                  </span>
                  <h3>{producto.nombre}</h3>
                  <p className="producto-descripcion">
                    {producto.descripcion}
                  </p>

                  <div className="producto-pie">
                    <strong>S/ {producto.precio.toFixed(2)}</strong>
                    <button
                      className="boton boton-principal"
                      onClick={() => agregarAlCarrito(producto)}
                    >
                      + Agregar
                    </button>
                  </div>

                  <button
                    className="enlace-detalles"
                    onClick={() => setProductoSeleccionado(producto)}
                  >
                    Ver detalles
                  </button>
                </div>
              </article>
            ))}
          </div>

          {productosFiltrados.length === 0 && (
            <p className="mensaje-vacio">
              No se encontraron productos con esos filtros.
            </p>
          )}
        </section>

        <section className="seccion-carrito" id="carrito">
          <div className="titulo-seccion">
            <div>
              <p className="etiqueta">TU SELECCIÓN</p>
              <h2>Carrito de compras</h2>
            </div>
            <span>{cantidadCarrito} unidades</span>
          </div>

          {carrito.length === 0 ? (
            <div className="carrito-vacio">
              <span>🛒</span>
              <h3>Tu carrito está vacío</h3>
              <p>Agrega productos del catálogo para continuar.</p>
            </div>
          ) : (
            <div className="carrito-contenido">
              <div className="lista-carrito">
                {carrito.map((item) => (
                  <article className="item-carrito" key={item.id}>
                    <span className="carrito-emoji">{item.emoji}</span>

                    <div className="carrito-info">
                      <h3>{item.nombre}</h3>
                      <p>S/ {item.precio.toFixed(2)} por unidad</p>
                    </div>

                    <div className="cantidad-controles">
                      <button
                        onClick={() => cambiarCantidad(item.id, -1)}
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>
                      <span>{item.cantidad}</span>
                      <button
                        onClick={() => cambiarCantidad(item.id, 1)}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>

                    <strong>
                      S/ {(item.precio * item.cantidad).toFixed(2)}
                    </strong>

                    <button
                      className="boton-eliminar"
                      onClick={() => eliminarDelCarrito(item.id)}
                    >
                      Eliminar
                    </button>
                  </article>
                ))}
              </div>

              <aside className="resumen-compra">
                <h3>Resumen del pedido</h3>
                <div className="resumen-linea">
                  <span>Subtotal</span>
                  <span>S/ {totalCarrito.toFixed(2)}</span>
                </div>
                <div className="resumen-linea">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <div className="resumen-total">
                  <span>Total</span>
                  <strong>S/ {totalCarrito.toFixed(2)}</strong>
                </div>

                <button
                  className="boton boton-principal boton-comprar"
                  onClick={() => setMostrarCheckout(true)}
                  disabled={carrito.length === 0}
                >
                  Continuar compra
                </button>

                <p className="aviso-demo">
                  Compra de demostración. No se realizará ningún cobro.
                </p>
              </aside>
            </div>
          )}
        </section>

        {ultimoPedido && (
          <section className="ultimo-pedido">
            <h3>Último pedido registrado</h3>
            <p>
              Número: <strong>{ultimoPedido.numero}</strong>
            </p>
            <p>Cliente: {ultimoPedido.cliente.nombre}</p>
            <p>Total: S/ {ultimoPedido.total.toFixed(2)}</p>
            <p className="aviso-demo">
              Este registro se conserva únicamente mientras la página siga
              abierta.
            </p>
          </section>
        )}
      </main>

      <footer className="pie-pagina">
        <p>© 2026 TechStore | Proyecto educativo desarrollado con React.</p>
        <p>Los pagos son simulados; no se procesan transacciones reales.</p>
      </footer>

      {notificacion && (
        <div className="notificacion" role="status">
          {notificacion}
        </div>
      )}

      {productoSeleccionado && (
        <div
          className="fondo-modal"
          onClick={() => setProductoSeleccionado(null)}
        >
          <section
            className="modal modal-producto"
            onClick={(evento) => evento.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-producto"
          >
            <button
              className="cerrar-modal"
              onClick={() => setProductoSeleccionado(null)}
              aria-label="Cerrar"
            >
              ×
            </button>

            <div className="detalle-emoji">
              {productoSeleccionado.emoji}
            </div>
            <span className="producto-categoria">
              {productoSeleccionado.categoria}
            </span>
            <h2 id="titulo-producto">{productoSeleccionado.nombre}</h2>
            <p>{productoSeleccionado.descripcion}</p>
            <p>Stock disponible: {productoSeleccionado.stock} unidades</p>
            <strong className="precio-detalle">
              S/ {productoSeleccionado.precio.toFixed(2)}
            </strong>

            <button
              className="boton boton-principal boton-comprar"
              onClick={() => {
                agregarAlCarrito(productoSeleccionado);
                setProductoSeleccionado(null);
              }}
            >
              Agregar al carrito
            </button>
          </section>
        </div>
      )}

      {mostrarCheckout && (
        <CheckoutModal
          carrito={carrito}
          total={totalCarrito}
          onClose={() => setMostrarCheckout(false)}
          onConfirmar={confirmarPedido}
        />
      )}
    </div>
  );
}

export default App;
