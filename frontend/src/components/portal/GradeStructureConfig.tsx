import React, { useState } from 'react';
import { Plus, Trash2, Save, AlertCircle } from 'lucide-react';

interface GradeComponent {
    id: string;
    name: string;
    weight: number;
}

interface GradeStructureConfigProps {
    classId: string;
    className: string;
    currentStructure?: GradeComponent[];
    onSave: (structure: GradeComponent[]) => void;
    onCancel: () => void;
}

export const GradeStructureConfig: React.FC<GradeStructureConfigProps> = ({
    classId,
    className,
    currentStructure,
    onSave,
    onCancel,
}) => {
    const [components, setComponents] = useState<GradeComponent[]>(
        currentStructure || [
            { id: '1', name: 'Chuyên cần', weight: 20 },
            { id: '2', name: 'Giữa kỳ', weight: 30 },
            { id: '3', name: 'Cuối kỳ', weight: 50 },
        ]
    );

    const addComponent = () => {
        const newId = String(Date.now());
        setComponents([...components, { id: newId, name: '', weight: 0 }]);
    };

    const removeComponent = (id: string) => {
        if (components.length <= 1) {
            alert('Phải có ít nhất 1 thành phần điểm!');
            return;
        }
        setComponents(components.filter(c => c.id !== id));
    };

    const updateComponent = (id: string, field: 'name' | 'weight', value: string | number) => {
        setComponents(components.map(c =>
            c.id === id ? { ...c, [field]: value } : c
        ));
    };

    const getTotalWeight = () => {
        return components.reduce((sum, c) => sum + Number(c.weight), 0);
    };

    const isValid = () => {
        const total = getTotalWeight();
        const hasEmptyNames = components.some(c => !c.name.trim());
        const hasZeroWeight = components.some(c => c.weight <= 0);
        return total === 100 && !hasEmptyNames && !hasZeroWeight;
    };

    const handleSave = () => {
        if (!isValid()) {
            alert('Vui lòng kiểm tra lại cấu hình:\n- Tổng tỷ trọng phải = 100%\n- Tên không được để trống\n- Tỷ trọng phải > 0');
            return;
        }
        onSave(components);
    };

    const totalWeight = getTotalWeight();
    const isValidTotal = totalWeight === 100;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-xl font-bold text-gray-800">Cấu hình cơ cấu điểm</h3>
                <p className="text-gray-500 text-sm mt-1">{className}</p>
            </div>

            {/* Info */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                    <AlertCircle size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Hướng dẫn:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Tổng tỷ trọng phải bằng <strong>100%</strong></li>
                            <li>Có thể thêm nhiều thành phần điểm tùy ý</li>
                            <li>Mỗi thành phần phải có tên và tỷ trọng {'>'} 0</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Components List */}
            <div className="space-y-3">
                {components.map((component, index) => (
                    <div key={component.id} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                        </div>

                        <div className="flex-1">
                            <input
                                type="text"
                                value={component.name}
                                onChange={(e) => updateComponent(component.id, 'name', e.target.value)}
                                placeholder="Tên thành phần (VD: Chuyên cần, Bài tập...)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={component.weight}
                                onChange={(e) => updateComponent(component.id, 'weight', Number(e.target.value))}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-gray-600 font-medium">%</span>
                        </div>

                        <button
                            onClick={() => removeComponent(component.id)}
                            disabled={components.length === 1}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Xóa thành phần"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Button */}
            <button
                onClick={addComponent}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
                <Plus size={20} />
                <span>Thêm thành phần điểm</span>
            </button>

            {/* Total Weight */}
            <div className={`p-4 rounded-lg border-2 ${isValidTotal ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800">Tổng tỷ trọng:</span>
                    <span className={`text-2xl font-bold ${isValidTotal ? 'text-green-600' : 'text-red-600'}`}>
                        {totalWeight}%
                    </span>
                </div>
                {!isValidTotal && (
                    <p className="text-sm text-red-600 mt-2">
                        {totalWeight < 100 ? `Còn thiếu ${100 - totalWeight}%` : `Thừa ${totalWeight - 100}%`}
                    </p>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <button
                    onClick={onCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                    Hủy
                </button>
                <button
                    onClick={handleSave}
                    disabled={!isValid()}
                    className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save size={18} />
                    <span>Lưu cấu hình</span>
                </button>
            </div>
        </div>
    );
};
