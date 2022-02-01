import { LightningElement, api } from "lwc";
const TILE_WRAPPER_SELECTED_CLASS = "tile-wrapper selected";
const TILE_WRAPPER_UNSELECTED_CLASS = "tile-wrapper";
export default class BoatTile extends LightningElement {
  @api boat;
  @api selectedBoatId;
  get backgroundStyle() {
    return `background-image:url(${this.boat.Picture__c})`;
  }
  get tileClass() {
    // If the variable is valid
    // If it's the current boat
          if (this.selectedBoatId == this.boat.Id) {
            return TILE_WRAPPER_SELECTED_CLASS;
          }
        // All other possibility
        return TILE_WRAPPER_UNSELECTED_CLASS;
      }
  selectBoat() {
    this.selectedBoatId = !this.selectedBoatId;
    const boatselect = new CustomEvent("boatselect", {
      detail: {
        boatId: this.boat.Id
      }
    });
    this.dispatchEvent(boatselect);
  }
}