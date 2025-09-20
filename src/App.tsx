
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod schema for MP form
const mpSchema = z.object({
  prefix: z.string().min(1, 'กรุณาเลือกคำนำหน้า'),
  firstName: z.string().min(1, 'กรุณากรอกชื่อ'),
  lastName: z.string().min(1, 'กรุณากรอกนามสกุล'),
  photo: z.instanceof(FileList).refine((files) => files.length === 1, 'กรุณาอัปโหลดรูปถ่าย'),
  workHistory: z.string().min(1, 'กรุณากรอกประวัติการทำงาน'),
  achievements: z.string().min(1, 'กรุณากรอกผลงานที่ผ่านมา'),
  ministerPosition: z.string(),
  ministry: z.string(),
  party: z.string().min(1, 'กรุณากรอกชื่อพรรค'),
});

type MP = z.infer<typeof mpSchema> & { id: number; photoUrl: string };

const prefixOptions = ['นาย', 'นาง', 'นางสาว', 'อื่นๆ'];

function App() {
  const [mpList, setMpList] = useState<MP[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof mpSchema>>({
    resolver: zodResolver(mpSchema),
  });

  // Handle form submit
  const onSubmit = (data: z.infer<typeof mpSchema>) => {
    const file = data.photo[0];
    const photoUrl = URL.createObjectURL(file);
    if (editId !== null) {
      setMpList((prev) =>
        prev.map((mp) =>
          mp.id === editId
            ? { ...data, id: editId, photoUrl }
            : mp
        )
      );
      setEditId(null);
    } else {
      setMpList((prev) => [
        ...prev,
        { ...data, id: Date.now(), photoUrl },
      ]);
    }
    reset();
  };

  // Handle edit
  const handleEdit = (mp: MP) => {
    setEditId(mp.id);
    setValue('prefix', mp.prefix);
    setValue('firstName', mp.firstName);
    setValue('lastName', mp.lastName);
    setValue('workHistory', mp.workHistory);
    setValue('achievements', mp.achievements);
    setValue('ministerPosition', mp.ministerPosition);
    setValue('ministry', mp.ministry);
    setValue('party', mp.party);
  };

  // Handle delete
  const handleDelete = (id: number) => {
    setMpList((prev) => prev.filter((mp) => mp.id !== id));
    if (editId === id) {
      setEditId(null);
      reset();
    }
  };

  return (
  <div className="min-h-screen bg-brown p-4">
      <div className="max-w-3xl mx-auto bg-accent rounded-lg shadow p-6 border-2 border-primary">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary-dark">ทำเนียบรายชื่อสมาชิกสภาผู้แทนราษฎร</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block mb-1 font-medium">คำนำหน้า</label>
            <select {...register('prefix')} className="w-full border-2 border-primary-light rounded px-3 py-2 bg-accent-light">
              <option value="">เลือก</option>
              {prefixOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.prefix && <p className="text-red-500 text-sm">{errors.prefix.message as string}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium">ชื่อ</label>
            <input {...register('firstName')} className="w-full border-2 border-primary-light rounded px-3 py-2 bg-accent-light" />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message as string}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium">นามสกุล</label>
            <input {...register('lastName')} className="w-full border-2 border-primary-light rounded px-3 py-2 bg-accent-light" />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message as string}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium">รูปถ่าย 2"</label>
            <input type="file" accept="image/*" {...register('photo')} className="w-full border-2 border-primary-light rounded px-3 py-2 bg-accent-light" />
            {errors.photo && <p className="text-red-500 text-sm">{errors.photo.message as string}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">ประวัติการทำงาน</label>
            <textarea {...register('workHistory')} className="w-full border-2 border-primary-light rounded px-3 py-2 bg-accent-light" rows={2} />
            {errors.workHistory && <p className="text-red-500 text-sm">{errors.workHistory.message as string}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">ผลงานที่ผ่านมา</label>
            <textarea {...register('achievements')} className="w-full border-2 border-primary-light rounded px-3 py-2 bg-accent-light" rows={2} />
            {errors.achievements && <p className="text-red-500 text-sm">{errors.achievements.message as string}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium">ตำแหน่งรัฐมนตรี</label>
            <input {...register('ministerPosition')} className="w-full border-2 border-primary-light rounded px-3 py-2 bg-accent-light" />
          </div>
          <div>
            <label className="block mb-1 font-medium">กระทรวง</label>
            <input {...register('ministry')} className="w-full border-2 border-primary-light rounded px-3 py-2 bg-accent-light" />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">สังกัดพรรคการเมือง</label>
            <input {...register('party')} className="w-full border-2 border-primary-light rounded px-3 py-2 bg-accent-light" />
            {errors.party && <p className="text-red-500 text-sm">{errors.party.message as string}</p>}
          </div>
          <div className="md:col-span-2 flex gap-2 justify-end">
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition">
              {editId !== null ? 'บันทึกการแก้ไข' : 'เพิ่มรายชื่อ'}
            </button>
            {editId !== null && (
              <button type="button" onClick={() => { setEditId(null); reset(); }} className="bg-primary-light text-primary-dark px-4 py-2 rounded hover:bg-primary transition">
                ยกเลิก
              </button>
            )}
          </div>
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-primary-light">
              <tr>
                <th className="border px-2 py-1">รูปถ่าย</th>
                <th className="border px-2 py-1">ชื่อ-นามสกุล</th>
                <th className="border px-2 py-1">ประวัติการทำงาน</th>
                <th className="border px-2 py-1">ผลงาน</th>
                <th className="border px-2 py-1">ตำแหน่งรัฐมนตรี</th>
                <th className="border px-2 py-1">กระทรวง</th>
                <th className="border px-2 py-1">พรรค</th>
                <th className="border px-2 py-1">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {mpList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">ไม่มีข้อมูล</td>
                </tr>
              ) : (
                mpList.map((mp) => (
                  <tr key={mp.id} className="hover:bg-primary-light">
                    <td className="border px-2 py-1">
                      <img src={mp.photoUrl} alt="รูปถ่าย" className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="border px-2 py-1">{mp.prefix} {mp.firstName} {mp.lastName}</td>
                    <td className="border px-2 py-1 whitespace-pre-line">{mp.workHistory}</td>
                    <td className="border px-2 py-1 whitespace-pre-line">{mp.achievements}</td>
                    <td className="border px-2 py-1">{mp.ministerPosition}</td>
                    <td className="border px-2 py-1">{mp.ministry}</td>
                    <td className="border px-2 py-1">{mp.party}</td>
                    <td className="border px-2 py-1 flex gap-1 justify-center">
                      <button onClick={() => handleEdit(mp)} className="bg-primary-light text-primary-dark px-2 py-1 rounded hover:bg-primary transition">แก้ไข</button>
                      <button onClick={() => handleDelete(mp.id)} className="bg-primary-dark text-white px-2 py-1 rounded hover:bg-primary transition">ลบ</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
