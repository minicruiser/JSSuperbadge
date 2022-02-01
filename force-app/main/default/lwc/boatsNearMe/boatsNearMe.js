import { LightningElement, wire, api } from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';

export default class BoatsNearMe extends LightningElement {
    @api boatTypeId;
    mapMarkers = [];
    isLoading = true;
    isRendered = false;
    latitude;
    longitude;

    @wire(getBoatsByLocation, { latitude: '$latitude', longitude: '$longitude', boatTypeId: '$boatTypeId' })
    wiredBoatsJSON({ error, data }) {
        
        if (data) {
            this.isLoading = true;
            this.createMapMarkers(JSON.parse(data));
            
        } else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: ERROR_TITLE,
                    message: error.body.message,
                    variant: ERROR_VARIANT
                })
            );
           // this.isLoading = false;
        }
    }

    getLocationFromBrowser() {
        navigator.geolocation.getCurrentPosition(
            position => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
            },
            (error) => {}
        );
    }

    createMapMarkers(boatData) {

        const newMarkers = boatData.map((boat) => {
            return {
                location: {
                    Latitude: boat.Geolocation__Latitude__s,
                    Longitude: boat.Geolocation__Longitude__s
                },
                title: boat.Name,
            };
        });

        newMarkers.unshift({
            location: {
                Latitude: this.latitude,
                Longitude: this.longitude
            },
            title: LABEL_YOU_ARE_HERE,
            icon: ICON_STANDARD_USER
        });

        this.mapMarkers = newMarkers;
        this.isLoading = false;

    }

    renderedCallback() {
        if (this.isRendered == false) {
            this.getLocationFromBrowser();
        }
        this.isRendered = true;
    }
}