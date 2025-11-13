import { ArrowLeft, Search, ChevronDown, ChevronRight, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Field {
  id: string;
  name: string;
  enabled: boolean;
}

interface FieldCategory {
  id: string;
  name: string;
  icon: string;
  fields: Field[];
  expanded: boolean;
}

const mockFieldCategories: FieldCategory[] = [
  {
    id: 'personal',
    name: 'Personal Details',
    icon: '👤',
    expanded: true,
    fields: [
      { id: 'first_name', name: 'First Name', enabled: true },
      { id: 'last_name', name: 'Last Name', enabled: true },
      { id: 'middle_name', name: 'Middle Name', enabled: false },
      { id: 'date_of_birth', name: 'Date of Birth', enabled: true },
      { id: 'gender', name: 'Gender', enabled: true },
      { id: 'marital_status', name: 'Marital Status', enabled: false },
      { id: 'nationality', name: 'Nationality', enabled: true },
      { id: 'blood_group', name: 'Blood Group', enabled: false },
      { id: 'emergency_contact', name: 'Emergency Contact', enabled: true },
      { id: 'emergency_phone', name: 'Emergency Phone', enabled: true },
    ],
  },
  {
    id: 'employment',
    name: 'Employment Details',
    icon: '💼',
    expanded: true,
    fields: [
      { id: 'employee_id', name: 'Employee ID', enabled: true },
      { id: 'department', name: 'Department', enabled: true },
      { id: 'designation', name: 'Designation', enabled: true },
      { id: 'joining_date', name: 'Joining Date', enabled: true },
      { id: 'employment_type', name: 'Employment Type', enabled: true },
      { id: 'work_location', name: 'Work Location', enabled: true },
      { id: 'reporting_manager', name: 'Reporting Manager', enabled: true },
      { id: 'probation_period', name: 'Probation Period', enabled: false },
      { id: 'notice_period', name: 'Notice Period', enabled: true },
      { id: 'shift_timing', name: 'Shift Timing', enabled: false },
    ],
  },
  {
    id: 'contact',
    name: 'Contact Details',
    icon: '📞',
    expanded: false,
    fields: [
      { id: 'primary_email', name: 'Primary Email', enabled: true },
      { id: 'secondary_email', name: 'Secondary Email', enabled: false },
      { id: 'primary_phone', name: 'Primary Phone', enabled: true },
      { id: 'secondary_phone', name: 'Secondary Phone', enabled: false },
      { id: 'work_phone', name: 'Work Phone', enabled: true },
      { id: 'home_phone', name: 'Home Phone', enabled: false },
      { id: 'mobile_phone', name: 'Mobile Phone', enabled: true },
    ],
  },
  {
    id: 'address',
    name: 'Address',
    icon: '🏠',
    expanded: false,
    fields: [
      { id: 'current_address_line1', name: 'Current Address Line 1', enabled: true },
      { id: 'current_address_line2', name: 'Current Address Line 2', enabled: true },
      { id: 'current_city', name: 'Current City', enabled: true },
      { id: 'current_state', name: 'Current State', enabled: true },
      { id: 'current_country', name: 'Current Country', enabled: true },
      { id: 'current_zipcode', name: 'Current ZIP Code', enabled: true },
      { id: 'permanent_address_line1', name: 'Permanent Address Line 1', enabled: false },
      { id: 'permanent_address_line2', name: 'Permanent Address Line 2', enabled: false },
      { id: 'permanent_city', name: 'Permanent City', enabled: false },
      { id: 'permanent_state', name: 'Permanent State', enabled: false },
      { id: 'permanent_country', name: 'Permanent Country', enabled: false },
      { id: 'permanent_zipcode', name: 'Permanent ZIP Code', enabled: false },
    ],
  },
  {
    id: 'compensation',
    name: 'Compensation & Benefits',
    icon: '💰',
    expanded: false,
    fields: [
      { id: 'basic_salary', name: 'Basic Salary', enabled: true },
      { id: 'gross_salary', name: 'Gross Salary', enabled: true },
      { id: 'net_salary', name: 'Net Salary', enabled: true },
      { id: 'hra', name: 'House Rent Allowance', enabled: false },
      { id: 'transport_allowance', name: 'Transport Allowance', enabled: false },
      { id: 'medical_allowance', name: 'Medical Allowance', enabled: false },
      { id: 'bonus', name: 'Bonus', enabled: false },
      { id: 'pf_number', name: 'PF Number', enabled: true },
      { id: 'esi_number', name: 'ESI Number', enabled: false },
      { id: 'insurance_policy', name: 'Insurance Policy', enabled: false },
    ],
  },
  {
    id: 'education',
    name: 'Education & Qualifications',
    icon: '🎓',
    expanded: false,
    fields: [
      { id: 'highest_qualification', name: 'Highest Qualification', enabled: true },
      { id: 'university', name: 'University', enabled: true },
      { id: 'degree', name: 'Degree', enabled: true },
      { id: 'major', name: 'Major/Specialization', enabled: true },
      { id: 'graduation_year', name: 'Graduation Year', enabled: true },
      { id: 'certifications', name: 'Certifications', enabled: false },
      { id: 'professional_memberships', name: 'Professional Memberships', enabled: false },
    ],
  },
  {
    id: 'documents',
    name: 'Documents & Identification',
    icon: '📄',
    expanded: false,
    fields: [
      { id: 'passport_number', name: 'Passport Number', enabled: false },
      { id: 'passport_expiry', name: 'Passport Expiry Date', enabled: false },
      { id: 'drivers_license', name: "Driver's License", enabled: false },
      { id: 'social_security', name: 'Social Security Number', enabled: true },
      { id: 'tax_id', name: 'Tax ID', enabled: true },
      { id: 'visa_status', name: 'Visa Status', enabled: false },
      { id: 'work_permit', name: 'Work Permit', enabled: false },
    ],
  },
  {
    id: 'bank',
    name: 'Bank Details',
    icon: '🏦',
    expanded: false,
    fields: [
      { id: 'bank_name', name: 'Bank Name', enabled: true },
      { id: 'account_number', name: 'Account Number', enabled: true },
      { id: 'account_holder_name', name: 'Account Holder Name', enabled: true },
      { id: 'ifsc_code', name: 'IFSC Code', enabled: true },
      { id: 'branch_name', name: 'Branch Name', enabled: false },
      { id: 'swift_code', name: 'SWIFT Code', enabled: false },
    ],
  },
];

interface FieldSettingsPageProps {
  companyId: string;
  onBack: () => void;
}

export default function FieldSettingsPage({ companyId, onBack }: FieldSettingsPageProps) {
  const [categories, setCategories] = useState<FieldCategory[]>(mockFieldCategories);
  const [hasChanges, setHasChanges] = useState(false);
  // Load settings for this company from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`fieldSettings_${companyId}`);
    if (saved) {
      try {
        setCategories(JSON.parse(saved));
      } catch {}
    }
  }, [companyId]);

  // Save settings to localStorage when categories change and hasChanges is true
  useEffect(() => {
    if (hasChanges) {
      localStorage.setItem(`fieldSettings_${companyId}`, JSON.stringify(categories));
    }
  }, [categories, hasChanges, companyId]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCategory = (categoryId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
      )
    );
  };

  const toggleField = (categoryId: string, fieldId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              fields: cat.fields.map(field =>
                field.id === fieldId ? { ...field, enabled: !field.enabled } : field
              ),
            }
          : cat
      )
    );
    setHasChanges(true);
  };

  const toggleAllInCategory = (categoryId: string, enabled: boolean) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              fields: cat.fields.map(field => ({ ...field, enabled })),
            }
          : cat
      )
    );
    setHasChanges(true);
  };

  const filteredCategories = categories.map(cat => ({
    ...cat,
    fields: cat.fields.filter(field =>
      field.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(cat => cat.fields.length > 0);

  const totalFields = categories.reduce((sum, cat) => sum + cat.fields.length, 0);
  const enabledFields = categories.reduce(
    (sum, cat) => sum + cat.fields.filter(f => f.enabled).length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Companies</span>
          </button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Field Settings</h1>
              <p className="text-slate-600">Configure visible fields for this company</p>
            </div>
            {hasChanges && (
              <button
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                onClick={() => {
                  localStorage.setItem(`fieldSettings_${companyId}`, JSON.stringify(categories));
                  setHasChanges(false);
                }}
              >
                <Save size={20} />
                Save Changes
              </button>
            )}
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-900">{enabledFields} / {totalFields}</div>
                <div className="text-sm text-slate-600">Fields enabled</div>
              </div>
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <div className="text-emerald-600 font-bold text-lg">
                  {Math.round((enabledFields / totalFields) * 100)}%
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search fields..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredCategories.map((category) => {
            const enabledCount = category.fields.filter(f => f.enabled).length;
            const totalCount = category.fields.length;
            const allEnabled = enabledCount === totalCount;

            return (
              <div key={category.id} className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                      >
                        {category.expanded ? (
                          <ChevronDown size={20} className="text-slate-600" />
                        ) : (
                          <ChevronRight size={20} className="text-slate-600" />
                        )}
                      </button>
                      <span className="text-2xl">{category.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 text-lg">{category.name}</h3>
                        <p className="text-sm text-slate-500">
                          {enabledCount} of {totalCount} fields enabled
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleAllInCategory(category.id, !allEnabled)}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        {allEnabled ? 'Disable All' : 'Enable All'}
                      </button>
                    </div>
                  </div>

                  {category.expanded && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {category.fields.map((field) => (
                          <label
                            key={field.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                          >
                            <input
                              type="checkbox"
                              checked={field.enabled}
                              onChange={() => toggleField(category.id, field.id)}
                              className="w-5 h-5 text-emerald-600 border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                            />
                            <span className="text-slate-700 group-hover:text-slate-900 font-medium">
                              {field.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <Search className="mx-auto text-slate-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No fields found</h3>
            <p className="text-slate-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
