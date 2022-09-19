document.addEventListener('DOMContentLoaded', ()=>{


// Hamburger

var hamburger = document.querySelector('header button');
		var nav = document.querySelector('header nav');

		hamburger.addEventListener('click',function(e){
			hamburger.classList.toggle('open');
			nav.classList.toggle('open');
		});



// Slider

 	/**
	 * Fonction raccourci de "document.querySelector"
	 * @param {string} $elem: élément HTML à sélectionner
	 * @param {string} $index (facultatif): index d'un élément HTML particulier dans un tableau d'éléments HTML
	 * @return {JS}
	 */
 function get($elem,$index='none'){

 	if($index==='none'){
 		if(document.querySelectorAll($elem).length > 1){
 		return document.querySelectorAll($elem)
	 	}else{
	 		return document.querySelector($elem)
	 	}
	 }else{
	 	return document.querySelectorAll($elem)[$index]
	 }	
 }

 
 	/**
	 * Fonction raccourci de mise en place d'écouteurs d'événements sur plusieurs éléments HTML
	 * @param {string} $elems: éléments HTML qui doivent recevoir les "listeners"
	 * @param {string} $event: type d'événement (click, change, mouseleave, scroll,...)
	 * @param {function} $fn: fonction de rappel
	 * @return {function} fonction de rappel avec l'objet "event" (e)
	 */
 function multipleEvents($elems,$event,$fn){

 	get($elems).forEach(elem=>{
 		elem.addEventListener($event, e=>{
 			return $fn(e)
 		})
 	})
 }

 	/**
	 * Ajoute un décalade de X% des slides présents dans le slider, ajoute la class active sur la slide en cours et sur la puce en cours
	 * @param {number} $position (facultatif) : index souhaité
	 * @return void (rien)
	 */
 function setTransformation($position="false"){

 	//On récupère l'index actuel du slider dans l'attribut "data-index" de la puce qui a la "class" active
	let i = get('#slider .puces .active').dataset.index
	//Si il n'y a pas d'argument (index) de spécifié....
	if($position==="false"){
		//On incrémente de 1
		i++
	}else{
		//Sinon, si il y a un index de spécifié, on change l'index en cours par celui qui a été spécifié
		i = $position
		//On marque une pause
		setPause()
	}
	//si l'index est supérieur au nombre de slide dans le slider, on change l'index à 0 pour le faire repartir au début
	if(i > slides.length-1)i = 0
	//si l'index est inférieur au nombre de slide dans le slider, on change l'index par le dernier index (la dernière slide) pour le faire retourner à la fin
	if(i<0)i = slides.length-1
    //On parcours toutes les slides présentes dans le slider
	slides.forEach( function(slide,index) {
		//On affecte à chaque slide un "translate" (décalage) de gauche à droite (ou inverse) en fonction de l'index (i)
		slide.style.transform = `translateY(${i * -100}%)`
		//Sur chaque puce, on supprime (si présente) la class active
		get('#slider .puces div',index).classList.remove('active')
		//Sur chaque slide, on supprime (si présente) la class active
		get('section#slider .container .slide',index).classList.remove('active')
	});

	//On ajoute la class active sur la puce avec l'index en cours (i)
	get('#slider .puces div',i).classList.add('active')
	//On ajoute la class active sur la slide avec l'index en cours (i)
	get('section#slider .container .slide',i).classList.add('active')


	get('#slider .sliderdesc .content h2').textContent = get('#slider .container .slide.active h2').innerText
	get('#slider .sliderdesc .content p').textContent = get('#slider .container .slide.active p').innerText


	// console.log(get('#slider .container .slide.active h2').innerText)
}

	/**
	 * Passe la variable "paused" à true et la repasse à false 3 secondes plus tard
	 * @return void (rien)
	 */
function setPause(){
	paused = true
	setTimeout(function() {
		paused = false
	}, 3000);
}

//Au passage de la souris sur le container du slider....
get('#slider .container').addEventListener('mouseover',e=>{
	//On passe la varible "paused" à true
	paused = true
})

//Lorsque la souris quitte sur le container du slider....
get('#slider .container').addEventListener('mouseleave',e=>{
	//On passe la varible "paused" à false
	paused = false
})


//Initialisation de la variable "paused" à false
let paused = false
//Initialisation de la variable "slides" comportant un tableau HTML des slides présentes dans le slider
const slides = get('#slider .container .slide')
//On adapte dynamiquement la largeur du container au nombre de slide dans le slider
// get('#slider .container').style.width = (slides.length*65)+'%';


//On créer un boucle "for" qui pour limite le nombre de slide présentes dans le slider
for (let i = 0; i < slides.length; i++) {
	//A chaque tour (donc slide dans le slider), on créé un élément HTML "div"
	const div = document.createElement('div')
	//On ajoute un attribut "data-index" sur chaque div créée avec la valeur de l'index de la boucle "for" (i) en cours
	div.dataset.index = i
	//Si la div est la première à être créée, on lui ajoute la class active
	if(i===0) div.classList.add('active')
	//On ajoute cette div dans la div qui contiendra toutes les divs (puces) 
	get('#slider .puces').append(div)
}



//Toutes les 3 secondes, le code entre les accolades de cette fonction sera exécuté
setInterval(function() {
	//Si la variable "paused" n'est pas à false
	if(!paused){
		//La fonction "setTransformation()" s'exécute
		setTransformation()
	}
}, 3000);


//On ajoute un événement d'écoute (au clique) à toutes les puces
multipleEvents('#slider .puces div','click',function(e){
	//En cas de clique, on ajoute l'index de la puce cliquée pour que la slide sélectionnée s'affiche
	setTransformation(e.target.dataset.index)
 })

////////////////////////////////////////////////TP ICI////////////////////////////////////////////

//On ajoute un événement d'écoute (au clique) aux 2 flèches de navigation (mes 2 flèches ont la class "arrow", celle de gauche à en plus la class "arrowLeft" et celle de droite à "arrowRight")
multipleEvents('#slider .arrow','click',function(e){
	//Au clique, on récupère l'index en cours....
	let i = get('#slider .puces .active').dataset.index
	//Si la flèche de navigation cliquée contient la class "arrowLeft", c'est qu'il faut décaler le slider vers la droite
	if(e.currentTarget.classList.contains('arrowLeft')){
		//On décrémente
		i--
	}else{
		//Sinon, c'est la flèche de droite qui a été cliquée et donc on incrémente de 1 pour décaler les slides vers la droite
		i++
	}
	//Un fois l'index incrémenté ou décrémenté, je l'applique à toutes mes slides
	setTransformation(i)
 })



























})