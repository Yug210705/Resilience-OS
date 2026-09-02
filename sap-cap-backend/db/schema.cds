namespace sap.resilience;

entity PurchaseOrders {
  key ID          : String;
      planID      : String;
      supplierID  : String;
      materialID  : String;
      quantity    : Integer;
      totalCost   : Decimal(15,2);
      status      : String;
      strategy    : String;
      createdAt   : DateTime;
      createdBy   : String;
}
