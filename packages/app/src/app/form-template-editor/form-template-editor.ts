import { Component, inject, signal } from "@angular/core";
import { FormArray, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { FieldType } from "../../context/shared/value-object/field-definition";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormField } from "@angular/material/form-field";
import { MatRadioModule } from "@angular/material/radio";
import { MatInputModule } from "@angular/material/input";

@Component({
    imports: [
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        ReactiveFormsModule,
        MatFormField,
        MatRadioModule,
        MatInputModule,
    ],
    templateUrl: "./form-template-editor.html",
    styles: `:host {flex-grow: 1}`,
})
export class FormTemplateEditor {
    private formBuilder = inject(FormBuilder);
    isSidebarOpen = signal(false);

    ftFormGroup = this.formBuilder.group({
        mode: [""],
        fields: this.formBuilder.array([]),
    });

    get fields() {
        return Object.entries(this.ftFormGroup.controls);
    }

    toggleSidebar() {
        this.isSidebarOpen.update((value) => !value);
        console.log(this.fields);
    }

    addField() {
        (this.ftFormGroup.get("fields") as FormArray).push(
            this.formBuilder.group({
                type: [""],
                name: [""],
            }),
        );
    }

    makeFieldControls() {
        return {
            name: [""],
            label: [""],
            required: [false],
        };
    }

    makeShortTextField() {
        this.formBuilder.group({
            type: [FieldType.SHORT_TEXT],
            ...this.makeFieldControls(),
        });
    }

    makeLongTextField() {
        this.formBuilder.group({
            type: [FieldType.LONG_TEXT],
            ...this.makeFieldControls(),
        });
    }

    makeDateField() {
        this.formBuilder.group({
            type: [FieldType.DATE],
            ...this.makeFieldControls(),
        });
    }

    makeCheckboxField() {
        this.formBuilder.group({
            type: [FieldType.DATE],
            ...this.makeFieldControls(),
        });
    }
}
