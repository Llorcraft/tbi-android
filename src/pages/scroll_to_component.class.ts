import { Keyboard, TextInput } from "ionic-angular";
import { AfterViewInit } from "@angular/core";

export class ScrollToComponent implements AfterViewInit {
  constructor(protected keyboard: Keyboard) {}
  protected offset = 60;

  protected on_keypress(event: KeyboardEvent) {
    if (event.which === 13) {
      (event.currentTarget as HTMLElement)
        .closest(".scroll-content")
        .scrollTo(0, 0);
      document.getElementById("submit-button").focus();
      //this.keyboard.hideFormAccessoryBar(true);
    }
  }

  ngAfterViewInit() {}

  public scrollTo(position: number) {
    Array.from(document.getElementsByClassName("scroll-content")).forEach(e =>
      e.scrollTo(0, position)
    );
  }

  private formatDecimals(element: TextInput) {
    if (!element._elementRef.nativeElement.firstElementChild.type.match(/(tel|number)/g) 
    || !!element._elementRef.nativeElement.firstElementChild.getAttribute('blur')) return;

    element.ionBlur.subscribe(e => {
      element._elementRef.nativeElement.firstElementChild.setAttribute('blur', 1);
      if('' == e.ngControl.valueAccessor.value.toString().trim()) return;
      e.ngControl.valueAccessor.value = (Number((e.ngControl.valueAccessor.value).toString().replace(/,/, '.')));
    });
  }

  protected get is_tablet(): boolean {
    return !(window.outerWidth < 768 || window.outerHeight < 768);
  }
  public on_focus(event: any) {
    // setTimeout(() => {
    //   event._elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //   setTimeout(() => {
    //     event._elementRef.nativeElement.closest('.scroll-content').scrollTop -= 30;
    //   }, 250);
    // }, 500);
    
    this.formatDecimals(event);

    setTimeout(() => {
      const elm = event._elementRef.nativeElement;
      // if (this.is_tablet) {
      //   event._elementRef.nativeElement.scrollIntoView({
      //     behavior: "smooth",
      //     block: "start"
      //   });
      // } else {
        elm
          .closest(".scroll-content")
          .scrollTo(0, elm.closest(".scroll-content").scrollTop - this.offset);
        setTimeout(
          () =>
            (elm.closest(".scroll-content").scrollTop +=
              elm.closest("ion-item").getBoundingClientRect().top -
              this.offset),
          150
        );
      //}
      //this.scroll(elm.closest('.scroll-content'), elm.closest('.scroll-content').scrollTop + elm.closest('ion-item').getBoundingClientRect().top - offset);
    }, 250);

    // setTimeout(() => {
    //   const elm = event._elementRef.nativeElement
    //   const offset = 60;
    //   //elm.closest('.scroll-content').scrollTo(0, elm.closest('.scroll-content').scrollTop - 50);
    //   elm.closest('.scroll-content').scrollTop =  elm.closest('.scroll-content').scrollTop + elm.closest('ion-item').getBoundingClientRect().top - offset;
    // }, 250);
  }

  protected scroll(elm: any, top: number) {
    if (elm.scrollTop < top) {
      elm.scrollTo(0, (elm.scrollTop += 50));
      setTimeout(() => this.scroll(elm, top), 1);
    } else {
      elm.scrollTo(0, top);
    }
  }
}
