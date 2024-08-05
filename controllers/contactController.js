const asyncHandler = require("express-async-handler"); //try catch (err)
const Contact = require("../models/contactModel");

// @desc Get all contacts
// @route GET /contacts
// 전체 연락처 보기
const getAllContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find();
    res.status(200).send(contacts);
});

// @desc Create a contact
// @route POST /contacts
// 새 연락처 추가하기
const createContact = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).send("필수값이 입력되지 않았습니다.");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
  });

  res.status(201).send("Create Contacts");
});

// @desc Get contact
// @route GET /contacts/:id
// 연락처 상세 보기
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    res.status(200).send(contact);
});

// @desc Update contact
// @route PUT /contacts/:id
// 연락처 수정하기
const updateContact = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { name, email, phone } = req.body;
    const contact = await Contact.findById(id);
    if (!contact) {
      res.status(404);
      throw new Error("Contact not found");
    }
  
    const updatedContact = await Contact.findByIdAndUpdate(
        id,
        { name, email, phone },
        { new: true }
    );

    res.status(200).send(updatedContact);
});

// @desc Delete contact
// @route DELETE /contacts/:id
// 연락처 삭제하기
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    await Contact.deleteOne();

    res.status(200).send(`Delete Contact for ID: ${req.params.id}`);
});

module.exports = {
  getAllContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};