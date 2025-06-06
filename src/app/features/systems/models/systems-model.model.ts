export class SystemEntity {
    system_id!: number;
    system_name!: string;
    leanix_id!: string;
    description!: string;
    owner!: string;
    owner_email!: string;
    version_number!: string;
    status!: string;
  }
  
  export class SystemsModel {
    systemEntity!: SystemEntity;
  }
  