import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from 'src/app/services/cliente.service';


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
//    listClientes:any[]=[
//      { idtipodoc:"C.C",identificacion:123,razonsocial:"TANIA GUZMAN RESTREPO THE QUEEN!",proveedores:50,ventas:150000000,nombrecompleto:'Tania Guzman'},
//      { idtipodoc:"C.C",identificacion:456,razonsocial:"JHON E THE KING!",proveedores:3,ventas:80.000,nombrecompleto:'Jhon Edison'}
// ];
public listClientes:any[0]=[];
public formaction="NUEVO";
public identificacionEdit: number|undefined;
  form:FormGroup;

  constructor(private fb:FormBuilder,
    private toastr: ToastrService,
    private _ClienteService :ClienteService) { 
    this.form=this.fb.group({
      idtipodocref:['-1',Validators.required],
      identificacion:['',[Validators.required,Validators.maxLength(11),Validators.minLength(1)]],
      nombrecompleto:['',[Validators.required,Validators.maxLength(150)]],
      razonsocial:['',[Validators.required,Validators.maxLength(150)]],
      proveedores:['0',[Validators.required]],
      ventas:['0',[Validators.required]],
    });

  }

  ngOnInit(): void {
    this.CargarClientes();
    this._ClienteService.InitTiposDocumento().subscribe(  error=> {
      console.log('errorinit-InitTiposDocumento');
          console.log(error);
      
  });
  }

  agregarCliente(){
 

    const cliente:any={

      //idtipodoc:this.form.get('idtipodoc')?.value,
      identificacion:this.form.get('identificacion')?.value,
      nombrecompleto:this.form.get('nombrecompleto')?.value.toUpperCase(),
      razonsocial:this.form.get('razonsocial')?.value.toUpperCase(),
      proveedores:this.form.get('proveedores')?.value,
      ventas:this.form.get('ventas')?.value,
      idtipodocref:this.form.get('idtipodocref')?.value,
    }
    if(cliente.idtipodocref=='-1'){
      this.toastr.error('Debe seleccionar un tipo de documento', 'Tipo de documento (Inválido)');
      return;
    }

    if(cliente.idtipodocref=='CE'){
      this.toastr.info('No se permite registrar clientes con (CE) Cédula Extranjeria!', 'Tipo de documento (Inválido)');
      return;
    }

    if(cliente.proveedores <0 ||cliente.ventas <0) {
      this.toastr.warning('El valor para proveedores o ventas no puede ser negativo', 'Valores Negativos (Inválido)');
      return;
    }


    if(this.identificacionEdit==undefined)
    {
          this._ClienteService.saveCliente(cliente).subscribe(data=>{      
                  
                  this.toastr.success('Se registro el nuevo cliente!', 'Cliente Registrado (Correcto)');
                  this.CargarClientes();
                  this.form.reset();
                  this.formaction="NUEVO";
              },
            error=> {
              this.toastr.error('Ocurrio un error al registrar el cliente', 'Error');
              console.log(error);
              
          });

        }else
        {
        
              this._ClienteService.editCliente(this.identificacionEdit,cliente).subscribe(data=>{       
                this.toastr.success('Se guardo el cliente!', 'Cliente Actualizado (Correcto)');
                this.form.reset();
                this.formaction="NUEVO";
                this.form.get('identificacion')?.enable();
                this.form.get('idtipodocref')?.enable();
                this.identificacionEdit=undefined;
                this.CargarClientes();
            },
          error=> {
            this.toastr.error('Ocurrio un error al editar el cliente', 'Error');
            console.log(error);
        
    });

          this.form.get('identificacion')?.disable();
      this.form.get('idtipodocref')?.disable();

      }

   // this.listClientes.push(cliente);
  

    
   
  }


  eliminarCliente(index:number,identificacion:number){


    this._ClienteService.deleteCliente(identificacion).subscribe({
      next: data=>{ 
        
        this.toastr.success(' Se ha eliminado el cliente! ' , 'Cliente Eliminado (Éxito)');
        this.listClientes();
    },
      error: err=>{
        this.toastr.error('Ocurrio un error al eliminar', 'Error');
      console.log( err);
    }
     });
  ;
   
    this.listClientes.splice(index,1);
  }

  CargarClientes(){

      this._ClienteService.getListClientes().subscribe({
        next: data=>{this.listClientes = data;
        console.log(data);},
        error: err=>console.log( err)
       });
    
  }

  editarCliente(cliente: any){

    this.formaction="EDITAR";
    this.identificacionEdit=cliente.identificacion;

    this.form.patchValue(
      {
        identificacion:cliente.identificacion,
        nombrecompleto:cliente.nombrecompleto,
        razonsocial:cliente.razonsocial,
        proveedores:cliente.proveedores,
        ventas:cliente.ventas,
        idtipodocref:cliente.idtipodocref
      });

      this.form.get('identificacion')?.disable();
      this.form.get('idtipodocref')?.disable();


  }
 

}


export interface iCliente{

    idtipodoc:string;
      identificacion:string;
      nombrecompleto:string;
      razonsocial:string;
      proveedores:string;
      ventas:string;
}
