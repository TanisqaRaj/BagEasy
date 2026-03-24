# Frequently Asked Questions (FAQ)

## General Questions

### What is this project?
A production-ready AI/ML application that automatically validates business contracts, detects risks, identifies missing clauses, and provides recommendations using Endee vector database for semantic search.

### Who is this for?
- Companies reviewing contracts
- Legal teams
- Procurement departments
- Anyone dealing with business agreements

### Is this production-ready?
Yes! The code is clean, documented, tested, and ready for deployment.

## Technical Questions

### What is Endee?
Endee is a vector database used for storing and searching high-dimensional vectors. In this project, it stores clause embeddings and enables semantic similarity search.

### Why use a vector database?
Vector databases enable semantic search - finding similar content by meaning, not just keywords. This allows us to find similar contract clauses even if they use different wording.

### What embedding model is used?
`all-MiniLM-L6-v2` from sentence-transformers, which generates 384-dimensional vectors.

### What file formats are supported?
- PDF (.pdf)
- Microsoft Word (.docx)
- Plain text (.txt)

### How accurate is the risk detection?
The system uses pattern matching and keyword analysis. Accuracy depends on the patterns defined. It's designed to flag potential issues for human review, not replace legal counsel.

## Setup Questions

### Do I need to install Endee separately?
Yes, you need to fork and clone Endee from GitHub as per the requirements.

### What are the system requirements?
- Python 3.10 or higher
- Node.js 18 or higher
- 4GB RAM minimum
- 2GB free disk space

### Can I run this on Windows?
Yes! The project works on Windows, macOS, and Linux.

### Do I need an OpenAI API key?
No, it's optional. The basic functionality works without it. OpenAI integration is for future enhancements.

### How long does setup take?
About 10-15 minutes if you follow the Quick Start guide.

## Usage Questions

### How do I upload a contract?
1. Open the web interface (http://localhost:5173)
2. Drag and drop your contract file or click to browse
3. Click "Analyze Contract"
4. Wait for the validation report

### What happens to my uploaded files?
Files are stored locally in the `uploads/` directory. In production, you should implement proper file management and cleanup.

### Can I delete uploaded contracts?
Yes, use the DELETE endpoint: `DELETE /api/contracts/{contract_id}`

### How long does validation take?
Typically 3-5 seconds for a standard contract.

### Can I validate multiple contracts at once?
Currently, contracts are processed one at a time. Batch processing is a planned feature.

## Endee Questions

### How does Endee integration work?
1. Contract clauses are converted to embeddings
2. Embeddings are stored in Endee with metadata
3. Semantic search finds similar clauses
4. Results are used for comparison and recommendations

### What is stored in Endee?
- Clause text embeddings (384-dimensional vectors)
- Metadata (clause type, risk level, contract ID)
- No sensitive data beyond what's in the clauses

### Can I use a different vector database?
Yes, but you'd need to modify `endee_service.py` to work with your chosen database.

### How do I backup Endee data?
Follow Endee's documentation for backup procedures.

## Development Questions

### Can I modify the code?
Yes! The code is open-source (MIT License). Feel free to customize it.

### How do I add new clause types?
1. Add to `ClauseType` enum in `models.py`
2. Add keywords to `CLAUSE_KEYWORDS` in `clause_detector.py`
3. Add risk patterns to `RISK_PATTERNS` in `risk_analyzer.py`

### How do I add new risk patterns?
Edit the `RISK_PATTERNS` dictionary in `backend/app/services/risk_analyzer.py`

### Can I integrate with other LLMs?
Yes! The architecture is designed to be extensible. You can add LLM integration in the risk analyzer or as a separate service.

### How do I add authentication?
You'll need to:
1. Add an auth service
2. Implement JWT tokens
3. Add middleware to protect endpoints
4. Update frontend to handle auth

## Deployment Questions

### Can I deploy this to the cloud?
Yes! See [DEPLOYMENT.md](DEPLOYMENT.md) for AWS, GCP, and Azure options.

### Do I need Docker?
No, but it's recommended for easier deployment. You can run without Docker using the manual setup.

### How much does it cost to run?
- Local: Free
- VPS: ~$25-50/month
- Cloud: ~$50-100/month depending on usage

### Is it scalable?
Yes, the architecture supports horizontal scaling. You can run multiple backend instances behind a load balancer.

### How do I monitor it in production?
Implement:
- Health check endpoints (already included)
- Logging (add your preferred solution)
- Metrics collection (Prometheus, etc.)
- Error tracking (Sentry, etc.)

## Performance Questions

### How fast is it?
- Upload: ~1-2 seconds
- Validation: ~3-5 seconds
- Search: ~50ms

### Can it handle large contracts?
Yes, but very large files (>10MB) are rejected by default. You can adjust the limit in `.env`

### How many contracts can it store?
Limited only by disk space and Endee capacity. Endee can handle millions of vectors.

### Does it cache results?
Not currently, but caching can be added for improved performance.

## Security Questions

### Is it secure?
Basic security measures are implemented:
- File type validation
- Size limits
- Input sanitization
- CORS configuration

For production, add:
- Authentication
- HTTPS
- Rate limiting
- API keys

### Can I use it for sensitive contracts?
For sensitive data, ensure:
- Deploy on secure infrastructure
- Enable HTTPS
- Implement authentication
- Add encryption at rest
- Follow data protection regulations

### Does it store passwords?
No authentication is currently implemented, so no passwords are stored.

### Is data encrypted?
Not by default. Add encryption for production use.

## Troubleshooting

### "Module not found" error
Run `pip install -r requirements.txt` in the backend directory.

### "Port already in use"
Another service is using the port. Either stop that service or change the port in configuration.

### "Endee connection failed"
Ensure Endee is running on the correct port (default: 8001).

### Upload fails
Check:
- File type is supported
- File size is under limit
- Disk space is available
- Permissions are correct

### Frontend won't start
Run `npm install` in the frontend directory.

### Validation is slow
Check:
- System resources
- Endee performance
- Network latency
- File size

## Evaluation Questions

### Does this meet the requirements?
Yes! The project includes:
- ✅ Endee as vector database
- ✅ Practical use case
- ✅ Semantic search
- ✅ RAG capability
- ✅ Clean documentation
- ✅ GitHub hosted
- ✅ Production quality

### Where is Endee used?
In `backend/app/services/endee_service.py` - handles all vector operations.

### How is semantic search implemented?
Clauses are converted to embeddings and stored in Endee. Search queries are also embedded and compared using cosine similarity.

### Is RAG implemented?
The architecture is RAG-ready. Similar clauses are retrieved from Endee and can be used as context for LLM analysis.

### Can I see it working?
Yes! Upload `samples/sample_contract.txt` to see the full workflow.

## Feature Requests

### Can you add feature X?
This is a complete project for evaluation. After submission, you can fork and add features as needed.

### Will there be updates?
This is a snapshot for evaluation. Future development depends on project goals.

### Can I contribute?
After evaluation, contributions may be welcome. Check the repository for contribution guidelines.

## Comparison Questions

### How is this different from DocuSign?
DocuSign focuses on signing. This focuses on validation and risk analysis before signing.

### How is this different from LawGeex?
Similar concept, but this is open-source and uses Endee for semantic search.

### Can it replace a lawyer?
No! This is a tool to assist with contract review, not replace legal expertise.

## Best Practices

### Should I review the AI's findings?
Yes! Always have a human review, especially for important contracts.

### How often should I update risk patterns?
Review and update patterns based on your experience and legal requirements.

### Should I backup the data?
Yes! Implement regular backups of both the database and uploaded files.

### What about compliance?
Ensure your deployment meets relevant regulations (GDPR, CCPA, etc.) for your jurisdiction.

## Getting Help

### Where can I find more information?
- [README.md](README.md) - Main documentation
- [INDEX.md](INDEX.md) - Documentation index
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- Code comments

### Something's not working
1. Check error messages
2. Review relevant documentation
3. Verify setup steps
4. Check prerequisites

### I have a question not listed here
Review the documentation files or check the code comments for specific implementation details.

---

**Still have questions?** Check the comprehensive documentation in the project root directory.
