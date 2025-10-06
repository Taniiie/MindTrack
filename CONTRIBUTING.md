# Contributing to MindTrack

Thank you for your interest in contributing to MindTrack! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Use the bug report template**
3. **Include detailed information:**
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, versions)

### Suggesting Features

1. **Check existing feature requests**
2. **Describe the feature clearly:**
   - Use case and benefits
   - Proposed implementation
   - Potential challenges
   - Alternative solutions considered

### Code Contributions

#### Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/mindtrack.git
   ```
3. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Workflow

1. **Make your changes**
2. **Test thoroughly**
3. **Follow code style guidelines**
4. **Commit with clear messages:**
   ```bash
   git commit -m "Add: Feature description"
   ```
5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request**

## Code Style Guidelines

### Python (Backend)

- Follow PEP 8 style guide
- Use meaningful variable names
- Add docstrings to functions
- Keep functions focused and small
- Use type hints where appropriate

**Example:**
```python
def analyze_mood(text: str) -> dict:
    """
    Analyze mood from text input.
    
    Args:
        text: User's text input
        
    Returns:
        Dictionary containing mood analysis results
    """
    # Implementation
    pass
```

### JavaScript/React (Frontend)

- Use functional components with hooks
- Follow ESLint configuration
- Use meaningful component names
- Keep components small and focused
- Use PropTypes or TypeScript

**Example:**
```javascript
/**
 * MoodTracker component for analyzing user mood
 * @param {Object} props - Component props
 * @param {Function} props.onAnalyze - Callback when analysis completes
 */
export default function MoodTracker({ onAnalyze }) {
  // Implementation
}
```

### CSS/Tailwind

- Use Tailwind utility classes
- Follow mobile-first approach
- Keep custom CSS minimal
- Use consistent spacing scale

## Testing Guidelines

### Backend Tests

```python
def test_mood_analysis():
    """Test mood analysis functionality"""
    analyzer = MoodAnalyzer()
    result = analyzer.analyze_text("I feel happy today")
    assert result['mood_score'] > 0.5
```

### Frontend Tests

```javascript
test('renders mood tracker', () => {
  render(<MoodTracker />);
  expect(screen.getByText(/How are you feeling/i)).toBeInTheDocument();
});
```

## Commit Message Guidelines

Use conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**
```
feat: Add voice-based mood analysis
fix: Resolve database connection timeout
docs: Update API documentation
refactor: Optimize mood analysis algorithm
```

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Update CHANGELOG.md**
5. **Request review** from maintainers
6. **Address review feedback**
7. **Squash commits** if requested

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
```

## Project Structure

```
mindtrack/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── config.py           # Configuration
│   ├── database.py         # Database operations
│   ├── models/             # AI models
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── App.jsx         # Main app component
│   └── package.json        # Node dependencies
└── docs/                   # Documentation
```

## Areas for Contribution

### High Priority
- [ ] Voice-based mood analysis
- [ ] Wearable device integration
- [ ] Advanced ML models
- [ ] Mobile app development
- [ ] Accessibility improvements

### Medium Priority
- [ ] Additional cognitive games
- [ ] Social features
- [ ] Therapist portal
- [ ] Medication tracking
- [ ] Export/import data

### Low Priority
- [ ] UI/UX enhancements
- [ ] Performance optimizations
- [ ] Additional visualizations
- [ ] Internationalization
- [ ] Dark mode

## Resources

### Learning Resources
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [TextBlob Documentation](https://textblob.readthedocs.io/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Python Debugger](https://docs.python.org/3/library/pdb.html)

## Getting Help

- **Documentation**: Check README.md and other docs
- **Issues**: Search existing issues
- **Discussions**: Use GitHub Discussions
- **Email**: Contact maintainers

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to MindTrack! Your efforts help improve mental health care for everyone. 💙🧠
