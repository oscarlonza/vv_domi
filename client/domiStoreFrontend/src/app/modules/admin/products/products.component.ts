import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../services/product.service';
type ActionType = 'new' | 'edit' | 'delete';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SharedModule,HttpClientModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export default class ProductsComponent {
  displayedColumns: string[] = ['name', 'description','price','quantity','image','actions'];
  class: string = ""
  title: string = "Listado de productos"
  pageSizeOptions: number[] = [10, 20, 50, 100]
  description: string = "Seleccione un registro para modificar"
  static switch: any = 0;
  dataSource: any = [];
  dataParams: any = {
    total: 0,
    size: 10,
    page: 1
  };
  constructor(private dialog: MatDialog,
    public productService: ProductService
  ) { }
  ngOnInit() {

    this.getProducts();
  }
  getProducts() {
    this.productService.getProducts(this.dataParams).subscribe({
      next: (res: any) => {
        console.log('res',res);
        this.dataSource = new MatTableDataSource(res.products);
        this.dataParams.total = res.products.length;
      },
      error: (err: any) => {
        this.dataSource = new MatTableDataSource([]);
        this.dataParams.total = 0;
        console.error('Error fetching data: ', err)},
      complete: () => console.log('Data fetching complete')
    });
  }
  applyFilter(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }
  handlePage(e: PageEvent){
    this.dataParams.size = e.pageSize;
    this.dataParams.page = e.pageIndex+1;
    this.getProducts();
  }
  openDialogProduct(data: any, action: any) {
    const dialogConfig = new MatDialogConfig();
    data.action = action;
    dialogConfig.data = data;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '57%';
    dialogConfig.height = "fit-content";
    const dialogRef = this.dialog.open(DialogProduct, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (ProductsComponent.switch == 1) {
        this.ngOnInit();
      }
      ProductsComponent.switch = 0;
    });
  }
  static changeValueDialog(value: any) {
    this.switch = value

  }
}
@Component({
  selector: 'DialogProduct',
  templateUrl: './DialogProduct.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
  imports: [SharedModule]  // Asumiendo que usas botones en el diáEscudo
})
export class DialogProduct implements OnInit {
  @ViewChild(ProductsComponent) team: ProductsComponent | undefined;
  actions = {
    new: 'Guardar',
    edit: 'Actualizar',
    delete: 'Eliminar',
  };
  action!: ActionType;
  title: any = null;
  form: FormGroup
  teamData: any = []
  previewUrl: any = null;
  constructor(
    public dialogRef: MatDialogRef<DialogProduct>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    /*    private teamService: TeamService */
  ) {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      price: ["", [Validators.required]],
      quantity: ["", [Validators.required]]
    });
  }
  ngOnInit() {
    this.action = this.data?.action;
    switch (this.action) {
      case 'new':
        this.title = 'Crear producto';
        break;
      case 'edit':
        this.title = 'Editar producto';
        this.form.setValue({
          name: this.data.name,
          price: this.data.price,
          quantity: this.data.quantity,
          description: this.data.description
        })
        this.previewUrl = this.data.image
        break;
      case 'delete':
        this.title = 'Eliminar producto';
        break;
    }
  }
  dialogClose() {
    this.dialogRef.close();
  }
  create() {

  }
  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element && element.files && element.files.length) {
      const file = element.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {

    }
  }

  openSnackBar(message: string, action: string, type: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type
    });
  }
}
