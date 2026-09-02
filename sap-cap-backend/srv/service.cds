using { sap.resilience as my } from '../db/schema';

service CatalogService {
  entity PurchaseOrders as projection on my.PurchaseOrders;
}

annotate CatalogService.PurchaseOrders with @(
  UI.LineItem : [
    { $Type : 'UI.DataField', Value : planID, Label : 'Plan ID' },
    { $Type : 'UI.DataField', Value : supplierID, Label : 'Supplier' },
    { $Type : 'UI.DataField', Value : materialID, Label : 'Material' },
    { $Type : 'UI.DataField', Value : quantity, Label : 'Quantity' },
    { $Type : 'UI.DataField', Value : totalCost, Label : 'Total Cost' },
    { $Type : 'UI.DataField', Value : status, Label : 'Status' },
    { $Type : 'UI.DataField', Value : createdAt, Label : 'Created At' }
  ],
  UI.HeaderInfo : {
    TypeName : 'Purchase Order',
    TypeNamePlural : 'Purchase Orders',
    Title : { $Type : 'UI.DataField', Value : ID }
  }
);
