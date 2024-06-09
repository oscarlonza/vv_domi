import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MatSnackBar } from '@angular/material/snack-bar';
type ActionType = 'new' | 'edit' | 'delete';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export default class ProductsComponent {
  displayedColumns: string[] = ['teamName', 'teamImage', 'actions'];
  class: string = ""
  title: string = "Listado de productos"
  pageSizeOptions: number[] = [10, 20, 50, 100]
  description: string = "Seleccione un registro para modificar"
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  static switch: any = 0;
  dataSource: any = [];
  constructor(private dialog: MatDialog,
  ) { }
  ngOnInit() {

    this.loadExistingTeams();
    this.dataSource.paginator = this.paginator;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  loadExistingTeams() {
    /*  let data = this.teamService.getTeams(); */

    /* this.dataSource = new MatTableDataSource<any>(data); */
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openDialogTeam(data: any, action: any) {
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
      teamName: ["", [Validators.required]],
      idTeam: [null]
    });
  }
  ngOnInit() {
    this.action = this.data?.action;
    this.loadExistingTeams();
    switch (this.action) {
      case 'new':
        this.title = 'Crear equipo';
        break;
      case 'edit':
        this.title = 'Editar equipo';
        this.form.setValue({
          teamName: this.data.teamName,
          idTeam: this.data.idTeam
        })
        this.previewUrl = this.data.teamImage || 'assets/flag.png'
        break;
      case 'delete':
        this.title = 'Eliminar equipo';
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
  loadExistingTeams() {
    /* this.teamData = this.teamService.getTeams()
    this.teamService.setTeams(this.teamData); */

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
