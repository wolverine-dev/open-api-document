import { ServiceGroup, DictionaryItem } from './types';

// ==========================================
// SERVICE DATA (Mock Database)
// ==========================================
export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: 'g1',
    key: 'ACCOUNT',
    title: 'Account',
    iconName: 'User',
    endpoints: [
      { 
        id: 'e1', 
        name: 'AddAccount',
        method: 'POST',
        path: '/api/Account/AddAccount',
        description: 'Karşı kurumda oluşturulan hesap planlarını almak ve/veya güncellemek (muhasebe)',
        requestParams: [
          { id: 'p1', name: 'siskodu', type: 'varchar', required: true, description: 'Hesabın sistemdeki kodu', defaultValue: 'SYS_001' },
          { id: 'p2', name: 'maS_USERID', type: 'int', required: true, description: 'Oluşturan Kullanıcı Kodu', defaultValue: '10' },
          { id: 'p3', name: 'hesapAdi', type: 'varchar', required: true, description: 'Hesap Adı' },
          { id: 'p4', name: 'paraBirimi', type: 'varchar', required: false, description: 'TL, USD, EUR', defaultValue: 'TL' }
        ],
        responseFields: [
          { id: 'r1', name: 'AccountId', type: 'int', required: true, description: 'Oluşan kayıt ID', defaultValue: '9999' },
          { 
            id: 'r2', 
            name: 'AuditLog', 
            type: 'object', 
            required: false, 
            description: 'İşlem log detayları',
            children: [
               { id: 'r2-1', name: 'CreatedDate', type: 'date', required: true, description: 'Oluşturulma zamanı' },
               { id: 'r2-2', name: 'ServerIP', type: 'string', required: false, description: 'Sunucu IP', defaultValue: '127.0.0.1' }
            ]
          }
        ]
      },
      { 
        id: 'e2', 
        name: 'UpdateAccount',
        method: 'POST',
        path: '/api/Account/UpdateAccount',
        description: 'Mevcut hesap bilgilerini güncellemek için kullanılır.',
        requestParams: [
            { id: 'p5', name: 'AccountId', type: 'int', required: true, description: 'Güncellenecek Hesap ID', defaultValue: '123' },
            { id: 'p6', name: 'AccountName', type: 'string', required: false, description: 'Yeni Hesap Adı' }
        ],
        responseFields: []
      },
    ]
  },
  {
    id: 'g2',
    key: 'ACCOUNTINGRECONCILIATION',
    title: 'AccountingReconciliation',
    iconName: 'FileText',
    endpoints: [
      { 
          id: 'e3', 
          name: 'Summary',
          method: 'GET',
          path: '/api/Accounting/Summary',
          description: 'Muhasebe mutabakat özeti.',
          requestParams: [],
          responseFields: []
      },
    ]
  },
  {
    id: 'g3',
    key: 'CFSMARKETING',
    title: 'CFSMarketing',
    iconName: 'Megaphone',
    endpoints: [
      { id: 'e4', name: 'GetCampaignList', method: 'GET', path: '/api/Marketing/Campaigns', description: 'Aktif kampanyaları listeler', requestParams: [], responseFields: [] },
    ]
  },
  {
    id: 'g4',
    key: 'CALCULATOR',
    title: 'Calculator',
    iconName: 'Calculator',
    endpoints: [
      { id: 'e6', name: 'CalcParticipation', method: 'POST', path: '/api/Calc/Participation', description: 'Katılım payı hesaplama servisi', requestParams: [], responseFields: [] },
    ]
  },
  {
    id: 'g5',
    key: 'CFSPAYMENT',
    title: 'CFSPayment',
    iconName: 'CreditCard',
    endpoints: [
      { id: 'e8', name: 'ExecuteCustomerPayment', method: 'POST', path: '/api/Payment/Execute', description: 'Ödeme işlemi başlatır', requestParams: [], responseFields: [] },
    ]
  },
  {
    id: 'g6',
    key: 'CUSTOMER',
    title: 'Customer',
    iconName: 'Users',
    endpoints: [
      { id: 'e10', name: 'GetCustomerInfo', method: 'GET', path: '/api/Customer/GetInfo', description: 'Müşteri detay bilgileri', requestParams: [], responseFields: [] },
    ]
  }
];

export const DICTIONARY_ITEMS: DictionaryItem[] = [
  { id: 'd1', key: 'AccountID', description: 'Müşterinin benzersiz hesap numarası.', type: 'integer' },
  { id: 'd2', key: 'TransactionDate', description: 'İşlemin gerçekleştiği tarih ve saat.', type: 'date' },
  { id: 'd3', key: 'Amount', description: 'İşlem tutarı.', type: 'decimal' },
  { id: 'd4', key: 'IsSuccessfull', description: 'İşlemin başarılı olup olmadığını belirtir.', type: 'boolean' },
  { id: 'd5', key: 'siskodu', description: 'Hesabın sistemdeki tekil kodu.', type: 'string' },
  { id: 'd6', key: 'maS_USERID', description: 'İşlemi yapan ana kullanıcı ID.', type: 'integer' },
];