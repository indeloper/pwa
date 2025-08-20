export abstract class BaseAdapter {
    abstract adaptFromResponse(response: any): any;
    abstract adaptToRequest(model: any): any;
    abstract adaptToModel(model: any): any;
}