import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'

export namespace Manager.Events.Type{

    export abstract class StatAbstract {
      public Data = '';
      public abstract CheckRequirements(_object:ObjectTemplate):void
      public abstract CreateStat ():StatAbstract;
      public InitData (_data:string):StatAbstract {
        this.Data = _data
        return this
      }
    }
    export type CreateStatDel = () => StatAbstract;

    export class Tag extends StatAbstract {
      public CreateStat (): StatAbstract {
        return new Tag()
      }

      public CheckRequirements (_object: any): void {
        alert(this.Data)
      }
    }

    export class Value extends StatAbstract {
      public CreateStat (): StatAbstract {
        return new Value()
      }

      public CheckRequirements (_object: any): void {
        console.log(this.Data)
      }
    }

    export class Design extends StatAbstract {
      public CreateStat (): StatAbstract {
        return new Design()
      }

      public CheckRequirements (_object: any): void {
        alert(this.Data)
      }
    }

    export class Label extends StatAbstract {
      public CreateStat (): StatAbstract {
        return new Label()
      }

      public CheckRequirements (_object: any): void {
        alert(this.Data)
      }
    }

    export class Id extends StatAbstract {
      public CreateStat (): StatAbstract {
        return new Id()
      }

      public CheckRequirements (_object: any): void {
        alert(this.Data)
      }
    }

  export class ElementType extends StatAbstract {
    public CreateStat (): StatAbstract {
      return new ElementType()
    }

    public CheckRequirements (_object: any): void {
      alert(this.Data)
    }
  }

  export class Placeholder extends StatAbstract {
    public CreateStat (): StatAbstract {
      return new Placeholder()
    }

    public CheckRequirements (_object: any): void {
      alert(this.Data)
    }
  }

  export class Tooltip extends StatAbstract {
    public CreateStat (): StatAbstract {
      return new Tooltip()
    }

    public CheckRequirements (_object: any): void {
      alert(this.Data)
    }
  }

  export class ItemList extends StatAbstract {
    public CreateStat (): StatAbstract {
      return new ItemList()
    }

    public CheckRequirements (_object: any): void {
      alert(this.Data)
    }
  }
}
