import bcrypt from 'bcryptjs';
import { db, closeDatabase } from './connection';
import { users, departments, categories, services } from './schema';
import { logger } from '../lib/logger';

async function seedDatabase() {
  try {
    logger.info('Starting database seeding...');

    // Create admin user
    const adminPasswordHash = await bcrypt.hash('admin123456', 12);
    
    const [adminUser] = await db
      .insert(users)
      .values({
        cpf: '00000000000',
        name: 'Administrador do Sistema',
        email: 'admin@govtech-pro.com.br',
        passwordHash: adminPasswordHash,
        role: 'admin',
        status: 'active',
        emailVerifiedAt: new Date(),
      })
      .onConflictDoNothing()
      .returning();

    if (adminUser) {
      logger.info('Admin user created:', adminUser.email);
    }

    // Create test citizen
    const citizenPasswordHash = await bcrypt.hash('citizen123', 12);
    
    const [citizenUser] = await db
      .insert(users)
      .values({
        cpf: '12345678901',
        name: 'Maria Silva Santos',
        email: 'maria@example.com',
        phone: '11987654321',
        passwordHash: citizenPasswordHash,
        role: 'citizen',
        status: 'active',
        emailVerifiedAt: new Date(),
      })
      .onConflictDoNothing()
      .returning();

    if (citizenUser) {
      logger.info('Test citizen created:', citizenUser.email);
    }

    // Create departments
    const departmentsData = [
      {
        name: 'Secretaria de Administração',
        description: 'Responsável pela gestão administrativa do município',
        code: 'ADMIN',
        contactEmail: 'admin@prefeitura.gov.br',
        contactPhone: '1133334444',
        workingHours: {
          monday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
          tuesday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
          wednesday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
          thursday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
          friday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
        },
      },
      {
        name: 'Secretaria de Obras',
        description: 'Responsável pelas obras e infraestrutura urbana',
        code: 'OBRAS',
        contactEmail: 'obras@prefeitura.gov.br',
        contactPhone: '1133335555',
        workingHours: {
          monday: { isOpen: true, openTime: '07:00', closeTime: '16:00' },
          tuesday: { isOpen: true, openTime: '07:00', closeTime: '16:00' },
          wednesday: { isOpen: true, openTime: '07:00', closeTime: '16:00' },
          thursday: { isOpen: true, openTime: '07:00', closeTime: '16:00' },
          friday: { isOpen: true, openTime: '07:00', closeTime: '16:00' },
        },
      },
      {
        name: 'Secretaria de Saúde',
        description: 'Responsável pelos serviços de saúde pública',
        code: 'SAUDE',
        contactEmail: 'saude@prefeitura.gov.br',
        contactPhone: '1133336666',
        workingHours: {
          monday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
          tuesday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
          wednesday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
          thursday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
          friday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
        },
      },
    ];

    const createdDepartments = await db
      .insert(departments)
      .values(departmentsData)
      .onConflictDoNothing()
      .returning();

    logger.info(`Created ${createdDepartments.length} departments`);

    // Create categories
    const categoriesData = [
      {
        name: 'Licenciamento',
        description: 'Licenças e alvarás diversos',
        code: 'LICENSING',
        icon: 'document-check',
        color: '#3B82F6',
        sortOrder: 1,
      },
      {
        name: 'Certidões',
        description: 'Emissão de certidões municipais',
        code: 'CERTIFICATES',
        icon: 'certificate',
        color: '#10B981',
        sortOrder: 2,
      },
      {
        name: 'Tributos',
        description: 'Questões tributárias e fiscais',
        code: 'TAXES',
        icon: 'currency-dollar',
        color: '#F59E0B',
        sortOrder: 3,
      },
      {
        name: 'Reclamações',
        description: 'Reclamações e denúncias',
        code: 'COMPLAINTS',
        icon: 'exclamation-triangle',
        color: '#EF4444',
        sortOrder: 4,
      },
      {
        name: 'Solicitações',
        description: 'Solicitações diversas',
        code: 'REQUESTS',
        icon: 'hand-raised',
        color: '#8B5CF6',
        sortOrder: 5,
      },
    ];

    const createdCategories = await db
      .insert(categories)
      .values(categoriesData)
      .onConflictDoNothing()
      .returning();

    logger.info(`Created ${createdCategories.length} categories`);

    // Create services
    if (createdDepartments.length > 0 && createdCategories.length > 0) {
      const servicesData = [
        {
          name: 'Alvará de Funcionamento',
          description: 'Solicitação de alvará para funcionamento de estabelecimento comercial',
          code: 'ALV_FUNC',
          categoryId: createdCategories.find(c => c.code === 'LICENSING')!.id,
          departmentId: createdDepartments.find(d => d.code === 'ADMIN')!.id,
          isOnline: true,
          estimatedDuration: 720, // 12 hours
          requiredDocuments: [
            {
              id: '1',
              name: 'RG do Responsável',
              description: 'Documento de identidade do responsável legal',
              isRequired: true,
              acceptedFormats: ['pdf', 'jpg', 'png'],
              maxSize: 5 * 1024 * 1024, // 5MB
            },
            {
              id: '2',
              name: 'CPF do Responsável',
              description: 'Cadastro de Pessoa Física do responsável legal',
              isRequired: true,
              acceptedFormats: ['pdf', 'jpg', 'png'],
              maxSize: 5 * 1024 * 1024,
            },
            {
              id: '3',
              name: 'Contrato Social',
              description: 'Contrato social da empresa (se pessoa jurídica)',
              isRequired: false,
              acceptedFormats: ['pdf'],
              maxSize: 10 * 1024 * 1024,
            },
          ],
          workflow: [
            {
              stepNumber: 1,
              name: 'Análise Documental',
              description: 'Verificação da documentação enviada',
              estimatedDuration: 240,
              isAutomated: false,
              requiredRole: 'operator',
            },
            {
              stepNumber: 2,
              name: 'Vistoria',
              description: 'Vistoria do estabelecimento',
              estimatedDuration: 480,
              isAutomated: false,
              requiredRole: 'operator',
            },
            {
              stepNumber: 3,
              name: 'Emissão do Alvará',
              description: 'Emissão do alvará de funcionamento',
              estimatedDuration: 60,
              isAutomated: true,
            },
          ],
          fees: [
            {
              name: 'Taxa de Alvará',
              amount: 15000, // R$ 150,00 em centavos
              currency: 'BRL',
              isRequired: true,
              description: 'Taxa municipal para emissão do alvará',
            },
          ],
        },
        {
          name: 'Certidão Negativa de Débitos',
          description: 'Emissão de certidão negativa de débitos municipais',
          code: 'CERT_NEG',
          categoryId: createdCategories.find(c => c.code === 'CERTIFICATES')!.id,
          departmentId: createdDepartments.find(d => d.code === 'ADMIN')!.id,
          isOnline: true,
          estimatedDuration: 60, // 1 hour
          requiredDocuments: [
            {
              id: '1',
              name: 'CPF/CNPJ',
              description: 'Documento de identificação fiscal',
              isRequired: true,
              acceptedFormats: ['pdf', 'jpg', 'png'],
              maxSize: 5 * 1024 * 1024,
            },
          ],
          workflow: [
            {
              stepNumber: 1,
              name: 'Consulta Automática',
              description: 'Consulta automática na base de dados',
              estimatedDuration: 5,
              isAutomated: true,
            },
            {
              stepNumber: 2,
              name: 'Emissão da Certidão',
              description: 'Geração automática da certidão',
              estimatedDuration: 5,
              isAutomated: true,
            },
          ],
          fees: [
            {
              name: 'Taxa de Emissão',
              amount: 500, // R$ 5,00 em centavos
              currency: 'BRL',
              isRequired: true,
              description: 'Taxa para emissão da certidão',
            },
          ],
        },
      ];

      const createdServices = await db
        .insert(services)
        .values(servicesData)
        .onConflictDoNothing()
        .returning();

      logger.info(`Created ${createdServices.length} services`);
    }

    logger.info('Database seeding completed successfully');
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

seedDatabase();