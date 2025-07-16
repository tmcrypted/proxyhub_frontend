import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Edit, DollarSign, Loader2, Save, X, Percent, Calendar } from "lucide-react";
import type { Pricing, UpdatePricingData } from "../model/types";
import { usePricingStore } from "../model/store";
import { useCurrentPricing, useLoading, useError } from "../model/selectors";

const AdminPricingManagement = () => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<UpdatePricingData>({});
  const [saving, setSaving] = useState(false);

  // Store hooks
  const {
    fetchCurrentPricing,
    updatePricing,
  } = usePricingStore();
  const currentPricing = useCurrentPricing();
  const loading = useLoading();
  const error = useError();

  useEffect(() => {
    fetchCurrentPricing();
  }, [fetchCurrentPricing]);

  const handleEditField = (field: string, value: any) => {
    setEditingField(field);
    setEditValues({ [field]: value });
  };

  const handleSaveField = async () => {
    if (!editingField || !currentPricing) return;
    
    setSaving(true);
    try {
      await updatePricing(editValues);
      setEditingField(null);
      setEditValues({});
    } catch (err) {
      console.error("Error updating pricing:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValues({});
  };

  const handleInputChange = (field: string, value: any) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  const renderEditableField = (
    label: string,
    field: string,
    value: any,
    type: 'number' | 'text' | 'datetime-local' = 'text',
    placeholder?: string,
    min?: number,
    max?: number,
    step?: number
  ) => {
    const isEditing = editingField === field;
    const currentValue = isEditing ? editValues[field] : value;

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </Label>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              type={type}
              value={currentValue || ''}
              onChange={(e) => handleInputChange(field, type === 'number' ? parseFloat(e.target.value) : e.target.value)}
              placeholder={placeholder}
              min={min}
              max={max}
              step={step}
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={handleSaveField}
              disabled={saving}
              className="h-8 px-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancelEdit}
              disabled={saving}
              className="h-8 px-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between group">
            <div className="text-2xl font-bold">
              {field === 'defaultPrice' && '$'}
              {field === 'discountPercent' && currentValue}%
              {field === 'discountPercent' && !currentValue && '0%'}
              {field === 'defaultPrice' && currentValue}
              {field === 'isDiscountActive' && (currentValue ? 'Active' : 'Inactive')}
              {field === 'discountStartDate' && (currentValue ? new Date(currentValue).toLocaleString() : 'Not set')}
              {field === 'discountEndDate' && (currentValue ? new Date(currentValue).toLocaleString() : 'Not set')}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleEditField(field, value)}
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 px-2"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading pricing data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => fetchCurrentPricing()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!currentPricing) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Pricing Management</h3>
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No pricing data
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              No pricing information is currently available.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Pricing Management</h3>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Current Pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {renderEditableField(
              'Default Price',
              'defaultPrice',
              currentPricing.defaultPrice,
              'number',
              '1.00',
              0,
              undefined,
              0.01
            )}
            
            {renderEditableField(
              'Discount Percent',
              'discountPercent',
              currentPricing.discountPercent,
              'number',
              '0',
              0,
              100,
              0.1
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Discount Active
              </Label>
              {editingField === 'isDiscountActive' ? (
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editValues.isDiscountActive || currentPricing.isDiscountActive}
                    onCheckedChange={(checked) => handleInputChange('isDiscountActive', checked)}
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveField}
                    disabled={saving}
                    className="h-8 px-2"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="h-8 px-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <Switch
                    checked={currentPricing.isDiscountActive}
                    disabled
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditField('isDiscountActive', currentPricing.isDiscountActive)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 px-2"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {currentPricing.isDiscountActive && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Discount Period
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                {renderEditableField(
                  'Start Date',
                  'discountStartDate',
                  currentPricing.discountStartDate,
                  'datetime-local'
                )}
                {renderEditableField(
                  'End Date',
                  'discountEndDate',
                  currentPricing.discountEndDate,
                  'datetime-local'
                )}
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date(currentPricing.updatedAt).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPricingManagement; 