const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Question = require('../model/questions');
const Option = require('../model/options');

// Create questions
router.post('/questions/create', async (req,res) => {
    try {
        console.log(req.body);
        const { title } = req.body;
        console.log(title);
        if(!title){
            return res.status(400).json({ error: 'Title is required' })
        }
        const question = new Question({ title });
        await question.save();
        res.json(question);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Failed to create the question'});
    }
});

// Add options to a question
router.post('/questions/:id/options/create', async (req, res) => {
    try {
      const { id } = req.params;
      const options = req.body;
  
      if (!Array.isArray(options) || options.length === 0) {
        return res.status(400).json({ error: 'Options must be provided as an array' });
      }
  
      const question = await Question.findById(id);
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }
  
      const createdOptions = [];
  
      for (const optionObj of options) {
        const { text } = optionObj;
  
        if (!text) {
          return res.status(400).json({ error: 'Option text is required' });
        }
  
        const option = new Option({ text, question: question._id });
        await option.save();

        // Update the question's options field
        question.addOption(option._id);
  
        // Generate the vote link
        const voteLink = `http://localhost:3000/options/${option._id}/add_vote`;
        option.link_to_vote = voteLink;
  
        createdOptions.push(option);
      }
      await question.save();
  
      res.json(createdOptions);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to add options to the question' });
    }
  });
  

// Add vote to an option
router.post('/options/:id/add_vote', async (req, res) => {
    try {
        const { id } = req.params;
        const option = await Option.findById(id);
        if(!option){
            return res.status(404).json({ error: 'Option not found' });
        }
        option.votes++;
        await option.save();
        res.json(option);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add Vote to the option' });
    }
})

//delete a queston
router.delete('/questions/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id);
        if(!question){
            return res.status(404).json({ error: 'Question not Found' });
        }
        if(question.options.length > 0){
            return res.status(400).json({ error: 'Cannot delete a question with options' });
        }
        await question.remove();
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete question' });
    }
});

// Delete an option
router.delete('/options/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const option = await Option.findById(id);
        if(!option){
            return res.status(404).json({ error: 'Option not found' });
        }
        if(option.votes > 0){
            return res.status(404).json({ error: 'Connot delete options with votes' });
        }
        await option.remove();
        res.json({ message: 'Option Deleted Successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to delete the option' });
    }
})

//View a question with its options and votes
router.get('/questions/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id).populate('options');
        if(!question){
            return res.status(404).json({ error: 'Question not found' }); 
        }
        res.json(question);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch the question' })
    }
})

module.exports = router;