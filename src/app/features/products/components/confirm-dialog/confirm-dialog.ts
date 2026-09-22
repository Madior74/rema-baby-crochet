import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  readonly open = input(false);
  readonly title = input('Confirmer');
  readonly message = input('Cette action est irréversible.');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
