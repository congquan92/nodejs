const categoryModel = require('../model/categoryModel');

async function getCategories(req, res) {
  try {
    const categories = await categoryModel.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
}

async function getCategory(req, res) {
  try {
    const category = await categoryModel.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
}

async function createCategory(req, res) {
  try {
    const { name, slug, description } = req.body;
    
    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required' });
    }
    
    const category = await categoryModel.createCategory({ name, slug, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
}

async function getTags(req, res) {
  try {
    const tags = await categoryModel.getAllTags();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tags', error: error.message });
  }
}

async function getTag(req, res) {
  try {
    const tag = await categoryModel.getTagById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.json(tag);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tag', error: error.message });
  }
}

async function createTag(req, res) {
  try {
    const { name, slug } = req.body;
    
    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required' });
    }
    
    const tag = await categoryModel.createTag({ name, slug });
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: 'Error creating tag', error: error.message });
  }
}

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  getTags,
  getTag,
  createTag
};
