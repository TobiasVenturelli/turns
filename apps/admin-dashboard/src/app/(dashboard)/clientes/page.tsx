/**
 * @file clientes/page.tsx
 * @description Página de gestión de clientes
 */

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { customersService } from '@/services/customers.service';
import { CustomerDetailsDialog } from '@/components/customers/customer-details-dialog';
import { Search, User, Mail, Phone, Calendar, Eye } from 'lucide-react';
import type { User as Customer } from '@/types';

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Obtener clientes
  const { data, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customersService.getAll(),
  });

  const customers = data?.customers || [];

  // Filtrar clientes por término de búsqueda
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.toLowerCase().includes(searchLower)
    );
  });

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona tu base de clientes
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {customers.length} {customers.length === 1 ? 'Cliente' : 'Clientes'}
        </Badge>
      </div>

      {/* Buscador */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Tabla de clientes */}
      {filteredCustomers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'No se encontraron clientes' : 'No hay clientes'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm
                ? 'Intenta con otro término de búsqueda'
                : 'Los clientes aparecerán cuando reserven turnos'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {customer.firstName} {customer.lastName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {customer.email || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {customer.phone || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(customer.createdAt).toLocaleDateString('es-ES')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(customer)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Dialog de detalles */}
      {selectedCustomer && (
        <CustomerDetailsDialog
          customer={selectedCustomer}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </div>
  );
}

