import AccessControl "authorization/access-control";

module {
  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
  };

  public func ensureReservedAdmin(old : OldActor) : NewActor {
    {
      old with accessControlState = old.accessControlState;
    };
  };

  public func run(old : OldActor) : NewActor {
    ensureReservedAdmin(old);
  };
};
