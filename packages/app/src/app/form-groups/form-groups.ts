import { Component, computed, inject, model } from "@angular/core";
import { FormTemplateService } from "../../services/form-template.service";
import { AuthService } from "../../services/auth.service";
import { MatCardModule } from "@angular/material/card";
import { StateService } from "../../services/state.service";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from "@angular/material/dialog";
import { GroupTypeService } from "../../services/group-type.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

export interface DialogData {
    name: string;
}

@Component({
    selector: "form-groups",
    templateUrl: "./form-groups.html",
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        RouterLink,
        MatDialogClose,
    ],
    styles: `:host {width: 100%;}`,
})
export class FormGroups {
    authService = inject(AuthService);
    stateService = inject(StateService);
    groupTypeService = inject(GroupTypeService);
    formTemplateService = inject(FormTemplateService);

    dialog = inject(MatDialog);
    name = model("");

    constructor() {
        if (!this.authService.isLoggedIn) {
            throw new Error("Can't render when logged out.");
        }
    }

    groupTypes = computed(() =>
        this.stateService.groupTypes().map(
            (gt) => (
                {
                    ...gt,
                    size: this.stateService.formTemplates().filter((ft) =>
                        ft.groupType === gt.name
                    ).length,
                }
            ),
        )
    );

    async openDialog(): Promise<void> {
        const dialogRef = this.dialog.open(CreateFormGroupDialog, {
            data: { name: this.name() },
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            console.log("The dialog was closed");
            if (result !== undefined) {
                const groupType = await this.groupTypeService.createGroupType({
                    name: result,
                });
                this.stateService.addGroupType(groupType);
            }
        });
    }

    deleteGroupType(id: string) {
        this.groupTypeService.deleteGroupType(id).then(() =>
            this.stateService.deleteGroupType(id)
        );
    }
}

@Component({
    selector: "create-form-group-dialog",
    templateUrl: "./create-form-group-dialog.html",
    imports: [
        ReactiveFormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogClose,
    ],
})
export class CreateFormGroupDialog {
    readonly dialogRef = inject(MatDialogRef<CreateFormGroupDialog>);
    readonly data = inject<DialogData>(MAT_DIALOG_DATA);
    readonly name = model(this.data.name);

    onNoClick(): void {
        this.dialogRef.close();
    }
}
