document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // CHATBOT
  // ==========================================

  const btnChat = document.getElementById('btn-chatbot');
  const chatWindow = document.getElementById('chat-window');
  const btnEnviarChat = document.getElementById('btn-enviar-chat');
  const chatInput = document.getElementById('chat-input');
  const chatBody = document.getElementById('chat-body');

  btnChat.addEventListener('click', () => {
    chatWindow.classList.toggle('oculto');
  });

  const responderBot = () => {

    setTimeout(() => {

      chatBody.innerHTML += `
        <p class="bot-msg">
          Nuestros asesores están ocupados, ¡pero las cabañas están espectaculares!
          Déjanos tus datos y te contactaremos.
        </p>
      `;

      chatBody.scrollTop = chatBody.scrollHeight;

    }, 1000);

  };

  btnEnviarChat.addEventListener('click', () => {

    if (chatInput.value.trim() !== '') {

      chatBody.innerHTML += `
        <p class="user-msg">
          ${chatInput.value}
        </p>
      `;

      chatInput.value = '';

      chatBody.scrollTop = chatBody.scrollHeight;

      responderBot();

    }

  });


  // ==========================================
  // LINKS FALSOS
  // ==========================================

  document.querySelectorAll('.link-falso').forEach(link => {

    link.addEventListener('click', (e) => {

      e.preventDefault();

      alert('Sección en construcción. ¡Pronto más novedades!');

    });

  });


  // ==========================================
  // CAMBIO DE INTERFAZ
  // ==========================================

  const btnCambio = document.getElementById('btn-cambio-interfaz');
  const glampingUI = document.getElementById('interfaz-glamping');
  const cortinas = document.getElementById('contenedor-cortinas');
  const cartaUI = document.getElementById('interfaz-carta');

  let threeJSInicializado = false;


  btnCambio.addEventListener('click', () => {

    glampingUI.style.display = 'none';

    cartaUI.style.display = 'flex';

    cortinas.style.display = 'flex';

    setTimeout(() => {

      cortinas.classList.add('abiertas');

    }, 300);

    setTimeout(() => {

      cortinas.style.display = 'none';

    }, 3000);


    if (!threeJSInicializado) {

      initThreeJS();

      threeJSInicializado = true;

    }

  });


  // ==========================================
  // THREE.JS + ROSA 3D
  // ==========================================

  function initThreeJS() {

    const container =
      document.getElementById('canvas-3d-container');


    // ==========================================
    // ESCENA
    // ==========================================

    const scene = new THREE.Scene();

    scene.background = null;


    // ==========================================
    // CÁMARA
    // ==========================================

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );


    // 📱 Cámara un poco más alejada
    camera.position.set(0, 0.8, 6.5);


    // ==========================================
    // RENDERER
    // ==========================================

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.outputEncoding = THREE.sRGBEncoding;

    container.appendChild(renderer.domElement);


    // ==========================================
    // CONTROLES
    // ==========================================

    const controls = new THREE.OrbitControls(
      camera,
      renderer.domElement
    );

    controls.enableZoom = false;

    controls.autoRotate = true;

    controls.autoRotateSpeed = 1.2;

    controls.enableDamping = true;

    controls.dampingFactor = 0.05;


    // ==========================================
    // ILUMINACIÓN
    // ==========================================

    const ambientLight =
      new THREE.AmbientLight(
        0xffffff,
        1.2
      );

    scene.add(ambientLight);


    const directionalLight =
      new THREE.DirectionalLight(
        0xffffff,
        2
      );

    directionalLight.position.set(
      5,
      8,
      5
    );

    scene.add(directionalLight);


    const pointLight =
      new THREE.PointLight(
        0xffb6c1,
        1.5,
        20
      );

    pointLight.position.set(
      -4,
      2,
      4
    );

    scene.add(pointLight);


    const fillLight =
      new THREE.PointLight(
        0xffffff,
        1,
        20
      );

    fillLight.position.set(
      4,
      1,
      -4
    );

    scene.add(fillLight);


    // ==========================================
    // GRUPO DE LA ROSA
    // ==========================================

    const roseGroup = new THREE.Group();

    scene.add(roseGroup);


    // ==========================================
    // CARGAR MODELO GLB
    // ==========================================

    const loader = new THREE.GLTFLoader();


    loader.load(

      // 🌹 UBICACIÓN DE TU ROSA
      'imagenes/rose-3d/source/rose.glb',


      // ========================================
      // ROSA CARGADA
      // ========================================

      function(gltf) {

        console.log('🌹 Rosa 3D cargada correctamente');

        const rose = gltf.scene;


        // ======================================
        // CALCULAR TAMAÑO
        // ======================================

        const box =
          new THREE.Box3().setFromObject(rose);

        const size =
          new THREE.Vector3();

        box.getSize(size);


        // ======================================
        // CENTRAR ROSA
        // ======================================

        const center =
          new THREE.Vector3();

        box.getCenter(center);

        rose.position.sub(center);


        // ======================================
        // ESCALA
        // ======================================

        const maxDimension =
          Math.max(
            size.x,
            size.y,
            size.z
          );


        if (maxDimension > 0) {

          /*
           * Antes estaba en 3.
           * Lo reducimos para que tenga
           * más espacio alrededor.
           */

          const escala =
            2.4 / maxDimension;

          rose.scale.set(
            escala,
            escala,
            escala
          );

        }


        // ======================================
        // ORIENTACIÓN
        // ======================================

        rose.rotation.y = Math.PI;


        // ======================================
        // AGREGAR AL GRUPO
        // ======================================

        roseGroup.add(rose);


        // ======================================
        // POSICIÓN
        // ======================================

        roseGroup.position.set(
          0,
          -0.15,
          0
        );


        // ======================================
        // ESCALA DEL GRUPO
        // ======================================

        roseGroup.scale.set(
          1,
          1,
          1
        );


        console.log('🌹 Modelo preparado');

      },


      // ========================================
      // PROGRESO
      // ========================================

      function(xhr) {

        if (xhr.total) {

          const porcentaje =
            (xhr.loaded / xhr.total) * 100;

          console.log(
            `🌹 Cargando rosa: ${porcentaje.toFixed(0)}%`
          );

        }

      },


      // ========================================
      // ERROR
      // ========================================

      function(error) {

        console.error(
          '❌ Error cargando la rosa:',
          error
        );

      }

    );


    // ==========================================
    // ANIMACIÓN
    // ==========================================

    function animate() {

      requestAnimationFrame(animate);

      controls.update();


      // Movimiento flotante
      if (roseGroup.children.length > 0) {

        roseGroup.position.y =
          -0.15 +
          Math.sin(
            Date.now() * 0.0015
          ) * 0.08;

      }


      renderer.render(
        scene,
        camera
      );

    }


    animate();


    // ==========================================
    // RESPONSIVE
    // ==========================================

    window.addEventListener('resize', () => {

      if (container.clientWidth > 0) {

        camera.aspect =
          container.clientWidth /
          container.clientHeight;

        camera.updateProjectionMatrix();


        renderer.setSize(
          container.clientWidth,
          container.clientHeight
        );

      }

    });

  }

});