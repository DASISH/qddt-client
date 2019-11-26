import { Component } from '@angular/core';


@Component({
 selector: 'qddt-spinner',
 template: `
 <div class="preloader-wrapper small active left">
 <div class="spinner-layer spinner-blue">
     <div class="circle-clipper left"><div class="circle"></div></div>
     <div class="gap-patch"><div class="circle"></div></div>
     <div class="circle-clipper right"><div class="circle"></div></div>
 </div>
 <div class="spinner-layer spinner-red">
     <div class="circle-clipper left"><div class="circle"></div></div>
     <div class="gap-patch"><div class="circle"></div></div>
     <div class="circle-clipper right"><div class="circle"></div></div>
 </div>
 <div class="spinner-layer spinner-yellow">
     <div class="circle-clipper left"><div class="circle"></div></div>
     <div class="gap-patch"><div class="circle"></div></div>
     <div class="circle-clipper right"><div class="circle"></div></div>
 </div>
 <div class="spinner-layer spinner-green">
     <div class="circle-clipper left"><div class="circle"></div></div>
     <div class="gap-patch"><div class="circle"></div></div>
     <div class="circle-clipper right"><div class="circle"></div></div>
 </div>
</div>
`,
})
export class SpinnerComponent { }
