import { AfterViewInit, Component, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../services/product.service';
import { NotificationImplService } from '../../../services/notification.service';
import { environment } from '../../../../environments/environment';
import { getErrorMessage, hideSpinner, showSpinner } from '../../../../app/services/functions.service';
type ActionType = 'new' | 'edit' | 'delete';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SharedModule, HttpClientModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export default class ProductsComponent {
  displayedColumns: string[] = ['name', 'description', 'price', 'quantity', 'image', 'actions'];
  class: string = ""
  title: string = "Listado de productos"
  pageSizeOptions: number[] = [10, 20, 50, 100]
  description: string = "Seleccione un registro para modificar"
  static switch: any = 0;
  dataSource: any = [];
  dataParams: any = {
    total: 0,
    limit: 10,
    page: 1,
    filter: '',
    order: 'desc'
  };
  public notificationService = inject(NotificationImplService);
  constructor(private dialog: MatDialog,
    public productService: ProductService
  ) { }
  async ngOnInit() {

    await this.getProducts();
  }
  async getProducts() {
    try {
      const result = await this.productService.getProducts(this.dataParams);
      console.log(environment.accessToken);
      //console.log('result', result);
      if (result.success) {
        this.dataSource = new MatTableDataSource(result.data.products);
        this.dataParams.total = result.data.totalProducts;
      } else {
        this.notificationService.errorNotification('Error en la solicitud');
        this.dataSource = new MatTableDataSource([]);
        this.dataParams.total = 0;
      }
    } catch (error) {
      const message = getErrorMessage(error)
      this.notificationService.errorNotification(message)
    }
  }
  applyFilter(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataParams.filter = filtro;
    this.getProducts();
    //this.dataSource.filter = filtro.trim().toLowerCase();
  }
  handlePage(e: PageEvent) {
    this.dataParams.limit = e.pageSize;
    this.dataParams.page = e.pageIndex + 1;
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
        this.getProducts();
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
  base64Image: any = null;
  public notificationService = inject(NotificationImplService);
  constructor(
    public productService: ProductService,
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
      quantity: [1, [Validators.required]]
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
  async create() {
    showSpinner();
    if (this.action == 'new' || this.action == 'edit') {
      if (this.base64Image) {
        this.form.value.image = this.base64Image;
      } else {
        this.form.value.image = this.previewUrl;
      }
      if (this.form.valid) {
        if (this.action == 'new') {
          try {
            const result = await this.productService.createProduct(this.form.value)
            if (result.success) {
              this.notificationService.successNotification('Creación de productos', 'Producto creado con éxito.');
              await ProductsComponent.changeValueDialog(1);
              this.dialogClose();
            } else {
              this.notificationService.errorNotification('Error en la creación de producto.');
            }
            hideSpinner()
          } catch (error) {
            hideSpinner()
            const message = getErrorMessage(error)
            this.notificationService.errorNotification(message);
          }
        } else {
          try {
            const result = await this.productService.updateProduct(this.form.value, this.data.id)
            if (result.success) {
              this.notificationService.successNotification('Actualización de productos', 'Producto actualizado con éxito.');
              await ProductsComponent.changeValueDialog(1);
              this.dialogClose();
            } else {
              this.notificationService.errorNotification('Error en la actualización de producto.');
            }
            hideSpinner()
          } catch (error) {
            hideSpinner()
            const message = getErrorMessage(error)
            this.notificationService.errorNotification(message);
          }
        }
      } else {
        hideSpinner()
        this.notificationService.errorNotification('Todos los campos son obligatorios.');
      }
    } else {
      try {
        const result = await this.productService.deleteProduct(this.data.id)
        if (result.success) {
          this.notificationService.successNotification('Eliminación de productos', result.message);
          await ProductsComponent.changeValueDialog(1);
          this.dialogClose();
        } else {
          this.notificationService.errorNotification('Error en la eliminación de producto.');
        }
        hideSpinner()
      } catch (error) {
        hideSpinner()
        const message = getErrorMessage(error)
        this.notificationService.errorNotification(message);
      }
    }

  }
  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element && element.files && element.files.length) {
      const file = element.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.base64Image = result.replace(/^data:image\/[a-z]+;base64,/, '');
        this.previewUrl = result;
        console.log(this.base64Image);
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
