const imageUpload = document.getElementById('imageUpload')
const preloader = document.getElementById('preloader')
const uploadContainer = document.getElementById('upload-container')

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)


/** Element visibility */
function showElement(el,bol){
  if(bol){
    el.style.display = "block";
  }else{
    el.style.display = "none";
  }
}

async function start() {
  const container = document.createElement('div')
  container.style.position = 'relative'
  document.body.append(container)
  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)

  console.log(`labeledFaceDescriptors:${labeledFaceDescriptors}`)

  let image
  let canvas

  showElement(preloader,false);
  showElement(uploadContainer,true);

  imageUpload.addEventListener('change', async () => {
    if (image) image.remove()
    if (canvas) canvas.remove()
    showElement(preloader,true);

    image = await faceapi.bufferToImage(imageUpload.files[0])
    container.append(image)
    canvas = faceapi.createCanvasFromMedia(image)
    container.append(canvas)
    const displaySize = { width: image.width, height: image.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))

    showElement(preloader,false);

    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box
      console.log(result.toString())
      const drawBox = new faceapi.draw.DrawBox(box, { label: ((result.toString().startsWith('Monkey')) ? 'Monkey' : 'Human') })
      drawBox.draw(canvas)
    })
  })
}

function loadLabeledImages() {

  // USE THIS TO GET THE DESCRIPTOR OF A TARGET IMAGE
  // I've preloaded the data as Float32Array to reduce http calls

  // const labels = ['yourLabel']
  // return Promise.all(
  //   labels.map(async label => {
  //     const descriptions = []
  //     for (let i = 1; i <= 1; i++) {
  //       const img = await faceapi.fetchImage(`https://scontent.fmnl3-1.fna.fbcdn.net/v/t1.0-9/20882571_10155614095983210_3643933726231267805_n.jpg?_nc_cat=108&_nc_oc=AQlWNq2aUFfYaYvRo4AEMIACbQl_0E92gpUD_UKivkvpx-Do-b0pm99WRjH4yItae-c&_nc_ht=scontent.fmnl3-1.fna&oh=4eba9ce82ca2f8e6155ee79d377c72f3&oe=5D82F1BF`)
  //       const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
  //       descriptions.push(detections.descriptor)
  //       console.log(`desc ${detections.descriptor}`)
  //     }
  //     return new faceapi.LabeledFaceDescriptors(label, descriptions)
  //   })
  // )



  const label = 'Monkey'
  descriptions = new Float32Array([-0.0938921719789505,0.18947453796863556,-0.0005620876327157021,-0.03708632290363312,-0.05099795386195183,0.0007866742089390755,-0.10289410501718521,-0.1295279562473297,0.15474383533000946,-0.0861549973487854,0.1457865685224533,0.011066625826060772,-0.23344652354717255,-0.053820863366127014,-0.07916290313005447,0.126599982380867,-0.21964477002620697,-0.10967104882001877,-0.06385587900876999,-0.025778980925679207,0.020374570041894913,-0.0009281104430556297,0.11783375591039658,0.061314765363931656,-0.06617531180381775,-0.292776882648468,-0.11859197169542313,-0.1027890294790268,0.07800249755382538,-0.09454354643821716,-0.0841328427195549,-0.02332228235900402,-0.18426112830638885,-0.10098437964916229,-0.03384404629468918,0.06570117175579071,-0.008587688207626343,-0.08841066062450409,0.22313277423381805,-0.05083766579627991,-0.11073732376098633,-0.01459763664752245,0.012858125381171703,0.2533998191356659,0.13648474216461182,0.06279926002025604,0.030688650906085968,-0.1279112994670868,0.10223889350891113,-0.1536455750465393,0.10428035259246826,0.15012098848819733,0.058728378266096115,0.07534755766391754,0.04062701016664505,-0.18098585307598114,0.04487942159175873,0.16625653207302094,-0.06568462401628494,0.026585232466459274,0.0905693992972374,-0.010014671832323074,0.045109011232852936,-0.07692514359951019,0.3013141453266144,0.0815107449889183,-0.09809575229883194,-0.11467010527849197,0.1775565892457962,-0.0424051508307457,-0.023412857204675674,-0.0005619442090392113,-0.10801686346530914,-0.12608602643013,-0.25992873311042786,0.08392124623060226,0.38734668493270874,0.15679369866847992,-0.1285310834646225,0.0327388271689415,-0.1528273969888687,-0.03161521628499031,0.07940441370010376,0.06571473926305771,-0.13856898248195648,-0.03075810894370079,-0.10610805451869965,0.009897440671920776,0.16949859261512756,0.011959359049797058,-0.04667462036013603,0.12830981612205505,0.009367735125124454,0.06103041023015976,0.05209703370928764,0.029520824551582336,-0.15417419373989105,0.07294594496488571,-0.14811299741268158,0.0919957086443901,0.03353922441601753,-0.10171659290790558,-0.018296297639608383,0.1670246124267578,-0.08218013495206833,0.032652076333761215,0.028200743719935417,-0.024091430008411407,0.03476037085056305,0.08211860805749893,-0.18410764634609222,-0.13013802468776703,0.14701856672763824,-0.25344976782798767,0.21690970659255981,0.14322803914546967,0.03288620337843895,0.16465437412261963,0.1407114863395691,0.22215765714645386,-0.008763579651713371,0.0211490411311388,-0.18609540164470673,-0.053009286522865295,0.16205386817455292,0.009182292968034744,0.06986629962921143,0.07250986993312836])
  return new faceapi.LabeledFaceDescriptors(label, [descriptions])
}
