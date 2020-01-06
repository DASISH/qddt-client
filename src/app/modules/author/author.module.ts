import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { AuthorComponent } from './author.component';
import { AuthorDetailComponent } from './author.detail.component';
import { AuthorFormComponent } from './author.form.component';
import { AuthorRoutingModule } from './author.routes';


@NgModule({
    imports: [ ComponentsModule, AuthorRoutingModule ],
    declarations: [ AuthorComponent, AuthorDetailComponent, AuthorFormComponent ],
    exports: [ AuthorComponent ],
    providers: [  ]
})

export class AuthorModule { }
