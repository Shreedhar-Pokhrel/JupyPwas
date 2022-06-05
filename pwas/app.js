/* var head = document.getElementsByTagName("head")[0];
head.innerHTML +=`    
    <meta name="theme-color" content="#000000">
    <link rel="manifest" href="../pwas/manifest.json">
    <link rel="apple-touch-icon" href="../pwas/image/512.png">
    <script src="../pwas/app.js"></script>  
`
*/

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('../sw.js')
    .then(reg => console.log('service worker registered'))
    .catch(err => console.log('service worker not registered', err));
}


