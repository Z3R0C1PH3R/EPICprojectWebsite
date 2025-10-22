import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Users, Building } from 'lucide-react';

const backend_url = import.meta.env.VITE_BACKEND_URL;

interface TeamMember {
  id: string;
  name: string;
  designation?: string;
  role: string;
  department?: string;
  bio: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  webpage?: string;
  image?: string;
}

interface Partner {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
}

const TeamAdmin = () => {
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: '1',
      name: 'Agricultural Engineering Institute',
      description: 'Leading research in sustainable irrigation systems and water resource management.',
      members: []
    },
    {
      id: '2',
      name: 'Environmental Science Center',
      description: 'Specializing in climate adaptation strategies and community-based water management.',
      members: []
    },
    {
      id: '3',
      name: 'Development Studies Foundation',
      description: 'Focusing on gender equity in irrigation access and participatory approaches.',
      members: []
    },
    {
      id: '4',
      name: 'Technology Innovation Lab',
      description: 'Developing smart irrigation systems and IoT solutions for precision agriculture.',
      members: []
    },
    {
      id: '5',
      name: 'Agricultural Economics Research',
      description: 'Coordinating field studies and community engagement programs.',
      members: []
    },
    {
      id: '6',
      name: 'Data Analytics Institute',
      description: 'Leading data analysis and modeling efforts for irrigation system effectiveness.',
      members: []
    },
    {
      id: '7',
      name: 'Water Resources Center',
      description: 'Providing strategic guidance and oversight for research initiatives.',
      members: []
    },
    {
      id: '8',
      name: 'International Water Management',
      description: 'Regional advisory and technical support for water management projects.',
      members: []
    }
  ]);

  const [editingMember, setEditingMember] = useState<{ partnerId: string; memberId: string } | null>(null);
  const [editingPartner, setEditingPartner] = useState<string | null>(null);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({});
  const [showAddMember, setShowAddMember] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch(`${backend_url}/get_partners`);
      if (response.ok) {
        const data = await response.json();
        setPartners(data);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setEditPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePartner = async (partnerId: string) => {
    try {
      const partner = partners.find(p => p.id === partnerId);
      if (!partner) return;

      const formData = new FormData();
      formData.append('partner_id', partnerId);
      formData.append('name', partner.name);
      formData.append('description', partner.description);

      const response = await fetch(`${backend_url}/update_partner`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setEditingPartner(null);
        fetchPartners();
      } else {
        alert('Error updating partner');
      }
    } catch (error) {
      console.error('Error saving partner:', error);
      alert('Error saving partner');
    }
  };

  const handleSaveMember = async (partnerId: string, memberId: string) => {
    try {
      const partner = partners.find(p => p.id === partnerId);
      const member = partner?.members.find(m => m.id === memberId);
      if (!member) return;

      const formData = new FormData();
      formData.append('partner_id', partnerId);
      formData.append('member_id', memberId);
      formData.append('name', member.name);
      formData.append('designation', member.designation || '');
      formData.append('role', member.role);
      formData.append('department', member.department || '');
      formData.append('bio', member.bio);
      formData.append('email', member.email || '');
      formData.append('linkedin', member.linkedin || '');
      formData.append('twitter', member.twitter || '');
      formData.append('webpage', member.webpage || '');
      
      // Add existing image path if no new photo
      if (!editPhotoFile && member.image) {
        formData.append('existing_image', member.image);
      }
      
      // Add new photo if selected
      if (editPhotoFile) {
        formData.append('photo', editPhotoFile);
      }

      const response = await fetch(`${backend_url}/update_team_member`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setEditingMember(null);
        setEditPhotoFile(null);
        setEditPhotoPreview(null);
        fetchPartners();
      } else {
        alert('Error updating team member');
      }
    } catch (error) {
      console.error('Error saving member:', error);
      alert('Error saving member');
    }
  };

  const handleAddMember = async (partnerId: string) => {
    try {
      const formData = new FormData();
      formData.append('partner_id', partnerId);
      formData.append('name', newMember.name || '');
      formData.append('designation', newMember.designation || '');
      formData.append('role', newMember.role || '');
      formData.append('department', newMember.department || '');
      formData.append('bio', newMember.bio || '');
      formData.append('email', newMember.email || '');
      formData.append('linkedin', newMember.linkedin || '');
      formData.append('twitter', newMember.twitter || '');
      formData.append('webpage', newMember.webpage || '');
      
      // Add photo file if selected
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const response = await fetch(`${backend_url}/add_team_member`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setShowAddMember(null);
        setNewMember({});
        setPhotoFile(null);
        setPhotoPreview(null);
        fetchPartners();
      } else {
        alert('Error adding team member');
      }
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Error adding member');
    }
  };

  const handleDeleteMember = async (partnerId: string, memberId: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      const formData = new FormData();
      formData.append('partner_id', partnerId);
      formData.append('member_id', memberId);

      const response = await fetch(`${backend_url}/delete_team_member`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        fetchPartners();
      } else {
        alert('Error deleting team member');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Error deleting member');
    }
  };

  const updatePartner = (partnerId: string, field: keyof Partner, value: string) => {
    setPartners(prev => prev.map(partner => 
      partner.id === partnerId ? { ...partner, [field]: value } : partner
    ));
  };

  const updateMember = (partnerId: string, memberId: string, field: keyof TeamMember, value: string) => {
    setPartners(prev => prev.map(partner => 
      partner.id === partnerId ? {
        ...partner,
        members: partner.members.map(member =>
          member.id === memberId ? { ...member, [field]: value } : member
        )
      } : partner
    ));
  };

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Team Management</h1>
          <p className="text-gray-600">Manage team members across 8 partner organizations</p>
        </motion.div>

        <div className="space-y-8">
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              {/* Partner Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Building className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    {editingPartner === partner.id ? (
                      <input
                        type="text"
                        value={partner.name}
                        onChange={(e) => updatePartner(partner.id, 'name', e.target.value)}
                        className="text-2xl font-bold border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold">{partner.name}</h2>
                    )}
                    {editingPartner === partner.id ? (
                      <textarea
                        value={partner.description}
                        onChange={(e) => updatePartner(partner.id, 'description', e.target.value)}
                        className="text-gray-600 border border-gray-300 rounded px-2 py-1 mt-1 w-full"
                        rows={2}
                      />
                    ) : (
                      <p className="text-gray-600">{partner.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {editingPartner === partner.id ? (
                    <>
                      <button
                        onClick={() => handleSavePartner(partner.id)}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPartner(null)}
                        className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditingPartner(partner.id)}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Partner
                    </button>
                  )}
                </div>
              </div>

              {/* Team Members */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Team Members ({partner.members.length})
                  </h3>
                  <button
                    onClick={() => setShowAddMember(showAddMember === partner.id ? null : partner.id)}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Member
                  </button>
                </div>

                {/* Add Member Form */}
                {showAddMember === partner.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
                  >
                    <h4 className="font-semibold mb-3">Add New Team Member</h4>
                    
                    {/* Photo Upload */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Photo Upload
                      </label>
                      <div className="flex items-center gap-4">
                        {photoPreview && (
                          <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-300">
                            <img 
                              src={photoPreview} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoSelect}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                          />
                          <p className="text-xs text-gray-500 mt-1">Upload a photo for the team member</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Name *"
                        value={newMember.name || ''}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Designation"
                        value={newMember.designation || ''}
                        onChange={(e) => setNewMember({ ...newMember, designation: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2"
                      />
                      <input
                        type="text"
                        placeholder="Role in EPIC *"
                        value={newMember.role || ''}
                        onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Department"
                        value={newMember.department || ''}
                        onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={newMember.email || ''}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2"
                      />
                      <input
                        type="url"
                        placeholder="Webpage URL"
                        value={newMember.webpage || ''}
                        onChange={(e) => setNewMember({ ...newMember, webpage: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2"
                      />
                      <input
                        type="url"
                        placeholder="LinkedIn URL"
                        value={newMember.linkedin || ''}
                        onChange={(e) => setNewMember({ ...newMember, linkedin: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2"
                      />
                      <input
                        type="url"
                        placeholder="Twitter/X URL"
                        value={newMember.twitter || ''}
                        onChange={(e) => setNewMember({ ...newMember, twitter: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <textarea
                      placeholder="Bio *"
                      value={newMember.bio || ''}
                      onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                      className="border border-gray-300 rounded px-3 py-2 mt-4 w-full"
                      rows={4}
                      required
                    />
                    <p className="text-sm text-gray-500 mt-2">* Required fields</p>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleAddMember(partner.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Add Member
                      </button>
                      <button
                        onClick={() => {
                          setShowAddMember(null);
                          setNewMember({});
                          setPhotoFile(null);
                          setPhotoPreview(null);
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Members List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {partner.members.map((member) => (
                    <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                      {editingMember?.partnerId === partner.id && editingMember?.memberId === member.id ? (
                        <div className="space-y-3">
                          {/* Photo Upload for Edit */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Photo
                            </label>
                            <div className="flex items-center gap-2 mb-2">
                              {(editPhotoPreview || member.image) && (
                                <div className="w-16 h-16 rounded overflow-hidden border border-gray-300">
                                  <img 
                                    src={editPhotoPreview || `${backend_url}${member.image}`} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleEditPhotoSelect}
                                className="text-sm border border-gray-300 rounded px-2 py-1 flex-1"
                              />
                            </div>
                          </div>
                          
                          <input
                            type="text"
                            placeholder="Name *"
                            value={member.name}
                            onChange={(e) => updateMember(partner.id, member.id, 'name', e.target.value)}
                            className="font-semibold border border-gray-300 rounded px-2 py-1 w-full"
                          />
                          <input
                            type="text"
                            placeholder="Designation"
                            value={member.designation || ''}
                            onChange={(e) => updateMember(partner.id, member.id, 'designation', e.target.value)}
                            className="text-gray-700 border border-gray-300 rounded px-2 py-1 w-full"
                          />
                          <input
                            type="text"
                            placeholder="Role in EPIC *"
                            value={member.role}
                            onChange={(e) => updateMember(partner.id, member.id, 'role', e.target.value)}
                            className="text-blue-600 border border-gray-300 rounded px-2 py-1 w-full"
                          />
                          <input
                            type="text"
                            placeholder="Department"
                            value={member.department || ''}
                            onChange={(e) => updateMember(partner.id, member.id, 'department', e.target.value)}
                            className="text-gray-600 text-sm border border-gray-300 rounded px-2 py-1 w-full"
                          />
                          <textarea
                            placeholder="Bio *"
                            value={member.bio}
                            onChange={(e) => updateMember(partner.id, member.id, 'bio', e.target.value)}
                            className="text-gray-600 border border-gray-300 rounded px-2 py-1 w-full"
                            rows={3}
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            value={member.email || ''}
                            onChange={(e) => updateMember(partner.id, member.id, 'email', e.target.value)}
                            className="text-gray-600 border border-gray-300 rounded px-2 py-1 w-full"
                          />
                          <input
                            type="url"
                            placeholder="Webpage URL"
                            value={member.webpage || ''}
                            onChange={(e) => updateMember(partner.id, member.id, 'webpage', e.target.value)}
                            className="text-gray-600 border border-gray-300 rounded px-2 py-1 w-full"
                          />
                          <input
                            type="url"
                            placeholder="LinkedIn URL"
                            value={member.linkedin || ''}
                            onChange={(e) => updateMember(partner.id, member.id, 'linkedin', e.target.value)}
                            className="text-gray-600 border border-gray-300 rounded px-2 py-1 w-full"
                          />
                          <input
                            type="url"
                            placeholder="Twitter/X URL"
                            value={member.twitter || ''}
                            onChange={(e) => updateMember(partner.id, member.id, 'twitter', e.target.value)}
                            className="text-gray-600 border border-gray-300 rounded px-2 py-1 w-full"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveMember(partner.id, member.id)}
                              className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingMember(null);
                                setEditPhotoFile(null);
                                setEditPhotoPreview(null);
                              }}
                              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold">{member.name}</h4>
                              {member.designation && (
                                <p className="text-gray-700 text-sm">{member.designation}</p>
                              )}
                              <p className="text-blue-600 text-sm">{member.role}</p>
                              {member.department && (
                                <p className="text-gray-600 text-sm">{member.department}</p>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => setEditingMember({ partnerId: partner.id, memberId: member.id })}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMember(partner.id, member.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{member.bio}</p>
                          <div className="text-xs text-gray-500">
                            <p>Email: {member.email}</p>
                            <p>LinkedIn: {member.linkedin || 'Not provided'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {partner.members.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No team members yet. Add the first member to get started.</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamAdmin;
